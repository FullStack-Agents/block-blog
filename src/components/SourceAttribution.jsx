import React from 'react'
import { Container } from 'react-bootstrap'

const SOURCES = {
  'mastering-bitcoin-cash': {
    text:
      'The content on this page is adapted from Mastering Bitcoin Cash, which is adapted from Mastering Bitcoin by Andreas M. Antonopoulos First Edition which is licensed under Creative Commons Attribution-ShareAlike.',
    links: [
      {
        label: 'Mastering Bitcoin Cash',
        url: 'https://github.com/Bitcoin-com/mastering-bitcoin-cash',
      },
      {
        label: 'Mastering Bitcoin',
        url: 'https://github.com/bitcoinbook/bitcoinbook',
      },
      {
        label: 'Creative Commons Attribution-ShareAlike',
        url: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    ],
  },
}

/**
 * Renders a source-attribution footer for a lesson. Returns null if no
 * attribution source is configured for the given source key.
 */
export default function SourceAttribution({ source }) {
  const attribution = SOURCES[source]
  if (!attribution) return null

  return (
    <Container className="py-4">
      <hr className="mb-4" />
      <footer className="text-muted small">
        <p className="mb-2">{attribution.text}</p>
        {attribution.links.length > 0 && (
          <ul className="list-inline mb-0">
            {attribution.links.map((link) => (
              <li key={link.url} className="list-inline-item me-3">
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </footer>
    </Container>
  )
}
