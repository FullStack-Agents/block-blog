import React from 'react'
import { Container } from 'react-bootstrap'

const SOURCES = {
  'mastering-bitcoin-cash': {
    text: 'The content on this page is adapted from ', 
    links: [
      {
        label: 'Mastering Bitcoin Cash',
        url: 'https://github.com/Bitcoin-com/mastering-bitcoin-cash',
      },
    ],
    mid: ', which is adapted from ',
    links2: [
      {
        label: 'Mastering Bitcoin',
        url: 'https://github.com/bitcoinbook/bitcoinbook',
      },
    ],
    end: ' by Andreas M. Antonopoulos First Edition which is licensed under ',
    links3: [
      {
        label: 'Creative Commons Attribution-ShareAlike',
        url: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    ],
    tail: '.',
  },
}

function renderLinks(links, keyPrefix) {
  return links.map((link) => (
    <a
      key={`${keyPrefix}-${link.url}`}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {link.label}
    </a>
  ))
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
        <p className="mb-0">
          {attribution.text}
          {renderLinks(attribution.links, 'a')}
          {attribution.mid}
          {renderLinks(attribution.links2, 'b')}
          {attribution.end}
          {renderLinks(attribution.links3, 'c')}
          {attribution.tail}
        </p>
      </footer>
    </Container>
  )
}
