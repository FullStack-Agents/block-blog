import { Highlight, themes } from 'prism-react-renderer'

// Shared styling for block-level code.
const blockStyle = {
  padding: '1rem',
  borderRadius: '0.375rem',
  overflowX: 'auto',
  marginBottom: '1rem',
  whiteSpace: 'pre',
}

/**
 * Code renderer for react-markdown.
 *
 * - Fenced code blocks with a language (```js) are highlighted with
 *   prism-react-renderer using a light "github" theme.
 * - Fenced code blocks WITHOUT a language (plain ``` blocks, e.g. ASCII
 *   diagrams) are rendered as a proper block-level <pre> so line breaks and
 *   spacing are preserved.
 * - True inline code (backticks in a paragraph) falls back to a plain <code>.
 */
export default function CodeBlock({ className, children }) {
  // A language fenced block carries a `language-xxx` className on the <code>.
  const match = /language-(\w+)/.exec(className || '')
  const text = String(children)

  // No language tag.
  if (!match) {
    // Multi-line content = a fenced block without a language. Render as a
    // block-level <pre> so newlines and alignment are preserved.
    if (text.includes('\n')) {
      return (
        <pre className="code-block" style={blockStyle}>
          <code className={className}>{children}</code>
        </pre>
      )
    }

    // Single line with no language = inline code.
    return <code className={className}>{children}</code>
  }

  const language = match[1]
  const code = text.replace(/\n$/, '')

  return (
    <Highlight theme={themes.github} code={code} language={language}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className="code-block"
          style={{
            ...style,
            ...blockStyle,
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
