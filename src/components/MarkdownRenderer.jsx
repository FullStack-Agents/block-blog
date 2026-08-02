import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * Reusable markdown renderer.
 *
 * @param {string} content - Markdown source.
 * @param {'light' | 'dark'} variant - 'light' for normal cards/bot bubbles;
 *   'dark' for the user's primary-blue chat bubbles.
 */
export default function MarkdownRenderer({ content, variant = 'light' }) {
  const className =
    variant === 'dark'
      ? 'markdown-content markdown-content-dark'
      : 'markdown-content'

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
