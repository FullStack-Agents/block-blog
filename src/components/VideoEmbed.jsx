import React from 'react'

/**
 * Converts a video URL to an embeddable src.
 * Supports YouTube (watch?v=, youtu.be/, embed/, shorts/) and
 * Vimeo (vimeo.com/ID). Falls back to using the URL as-is.
 *
 * @param {string} url
 * @returns {string | null} embed src, or null if not recognized
 */
function toEmbedSrc(url) {
  if (!url) return null

  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  )
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  return null
}

/**
 * Renders an embedded video (iframe) for a given URL. Returns null if the
 * URL cannot be embedded (e.g. a plain link).
 *
 * Uses Bootstrap's `.ratio ratio-16x9` class for a responsive 16:9 container
 * (the iframe is absolutely positioned to fill it).
 */
export default function VideoEmbed({ url, title }) {
  const src = toEmbedSrc(url)
  if (!src) return null

  return (
    <div className="ratio ratio-16x9 mb-4 video-embed">
      <iframe
        src={src}
        title={title || 'Embedded video'}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}
