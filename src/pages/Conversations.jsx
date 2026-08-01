import React, { useEffect, useState } from 'react'
import { Container, Card, Spinner, Alert, Form, InputGroup, Pagination } from 'react-bootstrap'

import { getApiBaseUrl } from '../utils/api'

/**
 * Public Q&A archive page.
 *
 * Fetches answered conversations from the tech-support-bot API and displays
 * them in a paginated, searchable list.
 */
export default function Conversations() {
  const [allConversations, setAllConversations] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const apiUrl = `${getApiBaseUrl()}/conversations`

  useEffect(() => {
    let cancelled = false

    const fetchConversations = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(apiUrl)
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }

        const data = await res.json()
        const answered = (data.conversations || [])
          .filter((c) => c.status === 'answered')
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

        if (!cancelled) {
          setAllConversations(answered)
          setFiltered(answered)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchConversations()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const term = search.trim().toLowerCase()
    if (!term) {
      setFiltered(allConversations)
    } else {
      setFiltered(
        allConversations.filter(
          (c) =>
            c.question.toLowerCase().includes(term) ||
            c.answer.toLowerCase().includes(term)
        )
      )
    }
    setCurrentPage(1)
  }, [search, allConversations])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <Container className="py-4">
      <h1 className="mb-3">Public Q&A Archive</h1>
      <p className="text-muted">
        Previously answered questions from the Ask Block bot.
      </p>

      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Search questions and answers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && pageItems.length === 0 && (
        <Alert variant="secondary">No answered questions found.</Alert>
      )}

      {pageItems.map((c) => (
        <Card key={c.id} className="mb-3">
          <Card.Body>
            <Card.Title>{c.question}</Card.Title>
            <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{c.answer}</Card.Text>
            <Card.Footer className="text-muted">
              {new Date(c.timestamp).toLocaleString()}
            </Card.Footer>
          </Card.Body>
        </Card>
      ))}

      {pageCount > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
          <Pagination.Prev
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          />
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
            disabled={currentPage === pageCount}
          />
          <Pagination.Last
            onClick={() => setCurrentPage(pageCount)}
            disabled={currentPage === pageCount}
          />
        </Pagination>
      )}
    </Container>
  )
}
