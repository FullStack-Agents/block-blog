import CodeBlock from './CodeBlock'

/**
 * Shared react-markdown `components` overrides.
 *
 * - `code`: renders fenced code blocks with syntax highlighting (CodeBlock).
 * - `pre`: react-markdown wraps fenced blocks in a <pre>; CodeBlock renders
 *   its own <pre>, so we pass the children through to avoid a nested <pre>.
 */
export const markdownComponents = {
  pre: ({ children }) => children,
  code: CodeBlock,
}
