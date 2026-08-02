import React, { useEffect, useRef, useState } from 'react'
import { Container, Form, Button, Card, Spinner, Alert } from 'react-bootstrap'
import {
  loadEphemeralKeypair,
  clearEphemeralKeypair,
  publishNip04DM,
  pollForResponses,
  testRelayConnection,
  BLOCK_PUBKEY,
  DEFAULT_RELAY,
  FALLBACK_RELAYS
} from '../utils/nostr'

const CONVERSATION_KEY = 'tech-support-conversation'

/**
 * Ask Block page.
 *
 * Generates an ephemeral Nostr keypair, lets the visitor send a NIP-04 DM
 * to Block, and polls for responses.
 */
export default function Ask() {
  const [keypair, setKeypair] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)
  const [relayStatus, setRelayStatus] = useState({})
  const pollTimerRef = useRef(null)

  useEffect(() => {
    const kp = loadEphemeralKeypair()
    setKeypair(kp)

    const saved = localStorage.getItem(CONVERSATION_KEY)
    if (saved) {
      try {
        setMessages(JSON.parse(saved))
      } catch {
        localStorage.removeItem(CONVERSATION_KEY)
      }
    }

    // Test raw WebSocket connectivity to each relay.
    ;(async () => {
      const status = {}
      for (const url of [DEFAULT_RELAY, ...FALLBACK_RELAYS]) {
        try {
          status[url] = await testRelayConnection(url, 4000)
        } catch {
          status[url] = false
        }
      }
      console.log('Relay raw WebSocket status:', status)
      setRelayStatus(status)
    })()

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current)
      }
    }
  }, [])

  const [relayPollStats, setRelayPollStats] = useState({})

  useEffect(() => {
    if (!keypair) return

    const poll = async () => {
      try {
        const since = Math.floor((Date.now() - 15 * 60 * 1000) / 1000) // last 15 minutes
        const { messages: responses, stats } = await pollForResponses({
          publicKey: keypair.publicKey,
          privateKey: keypair.privateKey,
          timeout: 8000,
          since
        })

        setRelayPollStats(stats)

        if (responses.length === 0) return

        setMessages((prev) => {
          const byId = new Map(prev.map((m) => [m.id, m]))
          for (const msg of responses) {
            byId.set(msg.id, {
              role: msg.senderPubkey === keypair.publicKey ? 'user' : 'bot',
              content: msg.content,
              timestamp: msg.createdAt * 1000,
              id: msg.id
            })
          }
          const merged = Array.from(byId.values())
          merged.sort((a, b) => a.timestamp - b.timestamp)
          return merged
        })
      } catch (err) {
        console.warn('Polling error:', err)
      }
    }

    poll()
    pollTimerRef.current = setInterval(poll, 5000)
  }, [keypair])

  useEffect(() => {
    if (messages.length === 0) return
    localStorage.setItem(CONVERSATION_KEY, JSON.stringify(messages))
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || !keypair || loading) return

    setLoading(true)
    setError(null)
    setInfo(null)

    const question = input.trim()

    try {
      const signedEvent = await publishNip04DM({
        privateKey: keypair.privateKey,
        publicKey: keypair.publicKey,
        recipientPubkey: BLOCK_PUBKEY,
        content: question
      })

      setMessages((prev) => [
        ...prev,
        {
          id: signedEvent.id,
          role: 'user',
          content: question,
          timestamp: Date.now()
        }
      ])
      setInput('')
      setInfo('Question sent. Block will reply via Nostr DM.')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    clearEphemeralKeypair()
    localStorage.removeItem(CONVERSATION_KEY)
    setMessages([])
    const kp = loadEphemeralKeypair()
    setKeypair(kp)
    setInfo('Started a new conversation.')
  }

  if (!keypair) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3 text-muted">Initializing ephemeral Nostr identity...</p>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <h1 className="mb-3">Ask Block</h1>
      <p className="text-muted">
        Ask a technical question about Bitcoin Cash, Nostr, IPFS, or related
        decentralized tech. Your identity is an ephemeral Nostr keypair that
        only lives in this browser tab.
      </p>

      {error && <Alert variant="danger">{error}</Alert>}
      {info && <Alert variant="info">{info}</Alert>}

      {Object.keys(relayStatus).length > 0 && (
        <Alert variant="secondary" className="py-2">
          <strong>Relay connectivity (raw WebSocket):</strong>
          <ul className="mb-0 mt-1">
            {Object.entries(relayStatus).map(([url, ok]) => (
              <li key={url}>
                {url}: {ok ? '✅ reachable' : '❌ unreachable'}
              </li>
            ))}
          </ul>
        </Alert>
      )}

      {Object.keys(relayPollStats).length > 0 && (
        <Alert variant="light" className="py-2">
          <strong>Last poll stats:</strong>
          <ul className="mb-0 mt-1">
            {Object.entries(relayPollStats).map(([url, stat]) => (
              <li key={url}>
                {url}: {' '}
                {stat.error
                  ? `❌ ${stat.error}`
                  : `${stat.events} events, ${stat.messages} messages`}
              </li>
            ))}
          </ul>
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body
          style={{ maxHeight: '60vh', overflowY: 'auto' }}
          className="bg-light"
        >
          {messages.length === 0 ? (
            <p className="text-muted text-center my-4">
              No messages yet. Type your question below.
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`d-flex mb-3 ${
                  msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'
                }`}
              >
                <div
                  className={`p-3 rounded ${
                    msg.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-white border'
                  }`}
                  style={{ maxWidth: '80%', whiteSpace: 'pre-wrap' }}
                >
                  {msg.content}
                  <div
                    className={`mt-1 small ${
                      msg.role === 'user' ? 'text-white-50' : 'text-muted'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </Card.Body>
      </Card>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="questionInput">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="What is CashScript?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
        </Form.Group>
        <div className="d-flex gap-2">
          <Button type="submit" variant="primary" disabled={loading || !input.trim()}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Sending...
              </>
            ) : (
              'Send Question'
            )}
          </Button>
          <Button variant="outline-secondary" onClick={handleReset} disabled={loading}>
            New Conversation
          </Button>
        </div>
      </Form>
    </Container>
  )
}
