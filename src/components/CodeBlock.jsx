import { Highlight, themes } from 'prism-react-renderer'

/**
 * Syntax-highlighted code block for react-markdown.
 *
 * Fenced code blocks (```js) are rendered with prism-react-renderer using a
 * light "github" theme. Inline code (no language) falls back to a plain <code>.
 */
export default function CodeBlock({ className, children }) {
  // A fenced block carries a `language-xxx` className on the <code> element.
  const match = /language-(\w+)/.exec(className || '')

  // Inline code — no highlighting.
  if (!match) {
    return <code className={className}>{children}</code>
  }

  const language = match[1]
  const code = String(children).replace(/\n$/, '')

  return (
    <Highlight theme={themes.github} code={code} language={language}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className="code-block"
          style={{
            ...style,
            padding: '1rem',
            borderRadius: '0.375rem',
            overflowX: 'auto',
            marginBottom: '1rem',
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
