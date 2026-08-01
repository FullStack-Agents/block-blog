/**
 * Nostr helpers for the Block tech-support web app.
 *
 * Uses nostr-tools for key generation, NIP-04 encrypt/decrypt, and relay
 * communication. Designed to run in the browser.
 */

import { generateSecretKey, getPublicKey, nip04 } from 'nostr-tools'
import { finalizeEvent } from 'nostr-tools/pure'
import { Relay } from 'nostr-tools/relay'

/** Target relay for DMs and polling. */
export const DEFAULT_RELAY = 'wss://nostr.fullstackcash.net'

/** Block's public key (hex) — the support bot. */
export const BLOCK_PUBKEY = 'a871a5978a666e72e7bfb0b221dc1df1fbb6499c77b29da6d692c3bbb3e17177'

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
    privkey = Buffer.from(sk).toString('hex')
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
 * Publish a NIP-04 DM to a relay.
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

  const relay = await Relay.connect(relayUrl)
  try {
    await relay.publish(signedEvent)
  } finally {
    relay.close()
  }

  return signedEvent
}

/**
 * Poll a relay for NIP-04 DMs addressed to the ephemeral pubkey.
 *
 * @param {object} params
 * @param {string} params.publicKey - hex public key of recipient
 * @param {string} params.privateKey - hex private key for decryption
 * @param {string} [params.relayUrl=DEFAULT_RELAY]
 * @param {number} [params.timeout=5000] - ms to wait for EOSE
 * @param {number} [params.limit=100]
 */
export async function pollForResponses({
  publicKey,
  privateKey,
  relayUrl = DEFAULT_RELAY,
  timeout = 5000,
  limit = 100
}) {
  const relay = await Relay.connect(relayUrl)

  try {
    const events = []

    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        sub.close()
        resolve()
      }, timeout)

      const sub = relay.subscribe(
        [
          {
            kinds: [4],
            '#p': [publicKey],
            limit
          }
        ],
        {
          onevent: (ev) => {
            if (ev.pubkey === publicKey) return // skip own events
            events.push(ev)
          },
          oneose: () => {
            clearTimeout(timer)
            sub.close()
            resolve()
          },
          onclose: (reason) => {
            clearTimeout(timer)
            if (reason) {
              reject(new Error(`Subscription closed: ${reason}`))
            } else {
              resolve()
            }
          }
        }
      )
    })

    const messages = []

    for (const ev of events) {
      try {
        const decrypted = await nip04.decrypt(privateKey, ev.pubkey, ev.content)
        messages.push({
          id: ev.id,
          content: decrypted,
          senderPubkey: ev.pubkey,
          createdAt: ev.created_at
        })
      } catch {
        // ignore decryption failures
      }
    }

    // sort newest last
    messages.sort((a, b) => a.createdAt - b.createdAt)

    return messages
  } finally {
    relay.close()
  }
}
