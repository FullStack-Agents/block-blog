/**
 * Nostr helpers for the Block tech-support web app.
 *
 * Uses nostr-tools for key generation, NIP-04 encrypt/decrypt, and relay
 * communication. Designed to run in the browser.
 */

import { generateSecretKey, getPublicKey, nip04 } from 'nostr-tools'
import { finalizeEvent } from 'nostr-tools/pure'
import { Relay, useWebSocketImplementation } from 'nostr-tools/relay'

/** Target relay for DMs and polling. */
export const DEFAULT_RELAY = 'wss://nostr.fullstackcash.net'

/** Fallback relays to try if the default fails. */
export const FALLBACK_RELAYS = [
  'wss://nos.lol',
  'wss://relay.primal.net'
]

/** Block's public key (hex) — the support bot. */
export const BLOCK_PUBKEY = 'a871a5978a666e72e7bfb0b221dc1df1fbb6499c77b29da6d692c3bbb3e17177'

// Ensure nostr-tools uses the browser's native WebSocket.
if (typeof window !== 'undefined' && window.WebSocket) {
  useWebSocketImplementation(window.WebSocket)
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

/**
 * Load or create an ephemeral keypair.
 * Private key is kept in sessionStorage and never leaves the browser.
 */
export function loadEphemeralKeypair() {
  let privkey = sessionStorage.getItem('tech-support-privkey')

  if (!privkey) {
    const sk = generateSecretKey()
    privkey = bytesToHex(sk)
    sessionStorage.setItem('tech-support-privkey', privkey)
  }

  const sk = hexToBytes(privkey)
  return {
    privateKey: privkey,
    publicKey: getPublicKey(sk)
  }
}

/**
 * Remove the ephemeral keypair from sessionStorage.
 */
export function clearEphemeralKeypair() {
  sessionStorage.removeItem('tech-support-privkey')
}

/**
 * Test whether a raw WebSocket connection can be established to a relay.
 * Returns a promise that resolves with true/false.
 */
export async function testRelayConnection(relayUrl = DEFAULT_RELAY, timeout = 5000) {
  return new Promise((resolve) => {
    let settled = false
    const done = (result) => {
      if (settled) return
      settled = true
      try { ws.close() } catch {}
      resolve(result)
    }

    let ws
    try {
      ws = new window.WebSocket(relayUrl)
    } catch (err) {
      console.error('Failed to create WebSocket for', relayUrl, err)
      done(false)
      return
    }

    const timer = setTimeout(() => done(false), timeout)

    ws.onopen = () => {
      clearTimeout(timer)
      done(true)
    }
    ws.onerror = (err) => {
      clearTimeout(timer)
      console.error('WebSocket error for', relayUrl, err)
      done(false)
    }
    ws.onclose = () => {
      clearTimeout(timer)
      done(false)
    }
  })
}

/**
 * Publish a NIP-04 DM to a relay, falling back to known relays if needed.
 *
 * @param {object} params
 * @param {string} params.privateKey - hex private key
 * @param {string} params.publicKey - hex public key of sender
 * @param {string} params.recipientPubkey - hex public key of recipient
 * @param {string} params.content - plain text message
 * @param {string} [params.relayUrl=DEFAULT_RELAY]
 */
export async function publishNip04DM({
  privateKey,
  publicKey,
  recipientPubkey,
  content,
  relayUrl = DEFAULT_RELAY
}) {
  const encrypted = await nip04.encrypt(privateKey, recipientPubkey, content)

  const eventTemplate = {
    kind: 4,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['p', recipientPubkey]],
    content: encrypted
  }

  const sk = hexToBytes(privateKey)
  const signedEvent = finalizeEvent(eventTemplate, sk)

  const errors = []
  for (const url of [relayUrl, ...FALLBACK_RELAYS]) {
    let relay
    try {
      relay = await Relay.connect(url)
      await relay.publish(signedEvent)
      relay.close()
      return signedEvent
    } catch (err) {
      console.warn(`publishNip04DM failed on ${url}:`, err)
      errors.push({ url, error: err instanceof Error ? err.message : String(err) })
      if (relay) {
        try { relay.close() } catch {}
      }
    }
  }

  console.error('publishNip04DM all relays failed:', errors)
  throw new Error(`Failed to publish DM to any relay. Last error: ${errors[errors.length - 1]?.error}`)
}

/**
 * Poll all configured relays in parallel for NIP-04 DMs addressed to the
 * ephemeral pubkey. Merges, deduplicates, and decrypts the results.
 *
 * @param {object} params
 * @param {string} params.publicKey - hex public key of recipient
 * @param {string} params.privateKey - hex private key for decryption
 * @param {string} [params.relayUrl=DEFAULT_RELAY]
 * @param {number} [params.timeout=8000] - ms to wait for EOSE
 * @param {number} [params.limit=100]
 * @param {number} [params.since=0] - only fetch events after this unix timestamp
 * @returns {Promise<{messages: Array, stats: Object}>}
 */
export async function pollForResponses({
  publicKey,
  privateKey,
  relayUrl = DEFAULT_RELAY,
  timeout = 8000,
  limit = 100,
  since = 0
}) {
  const urls = [relayUrl, ...FALLBACK_RELAYS]
  const stats = {}

  const results = await Promise.all(
    urls.map(async (url) => {
      let relay
      try {
        relay = await Relay.connect(url)

        const events = []

        await new Promise((resolve) => {
          let settled = false
          const done = () => {
            if (settled) return
            settled = true
            clearTimeout(timer)
            try { sub.close() } catch {}
            resolve()
          }

          const timer = setTimeout(done, timeout)

          const filter = {
            kinds: [4],
            '#p': [publicKey],
            limit
          }
          if (since > 0) {
            filter.since = since
          }

          const sub = relay.subscribe([filter], {
            onevent: (ev) => {
              if (ev.pubkey === publicKey) return // skip own events
              events.push(ev)
            },
            oneose: done,
            onclose: done
          })
        })

        const messages = []
        const decryptErrors = []

        for (const ev of events) {
          try {
            const decrypted = await nip04.decrypt(privateKey, ev.pubkey, ev.content)
            messages.push({
              id: ev.id,
              content: decrypted,
              senderPubkey: ev.pubkey,
              createdAt: ev.created_at
            })
          } catch (err) {
            decryptErrors.push({ id: ev.id, error: err instanceof Error ? err.message : String(err) })
          }
        }

        if (decryptErrors.length > 0) {
          console.warn(`pollForResponses decryption errors on ${url}:`, decryptErrors)
        }

        stats[url] = { events: events.length, messages: messages.length }
        relay.close()
        return messages
      } catch (err) {
        console.warn(`pollForResponses failed on ${url}:`, err)
        stats[url] = { error: err instanceof Error ? err.message : String(err) }
        if (relay) {
          try { relay.close() } catch {}
        }
        return []
      }
    })
  )

  // Merge and deduplicate across all relays
  const byId = new Map()
  for (const batch of results) {
    for (const msg of batch) {
      byId.set(msg.id, msg)
    }
  }

  const messages = Array.from(byId.values())
  messages.sort((a, b) => a.createdAt - b.createdAt)

  console.log('pollForResponses stats:', stats, 'total unique messages:', messages.length)

  return { messages, stats }
}
