import { useEffect, useState } from 'react'

// Reads the active Bootstrap color scheme from <html data-bs-theme>.
export function getBootstrapTheme() {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.getAttribute('data-bs-theme') === 'dark'
    ? 'dark'
    : 'light'
}

// Re-renders the caller whenever the global theme attribute changes. Used by
// components (e.g. the syntax highlighter) that need to react to the toggle.
export default function useBootstrapTheme() {
  const [theme, setTheme] = useState(getBootstrapTheme)

  useEffect(() => {
    const target = document.documentElement
    const observer = new MutationObserver(() => setTheme(getBootstrapTheme()))
    observer.observe(target, { attributes: true, attributeFilter: ['data-bs-theme'] })
    setTheme(getBootstrapTheme())
    return () => observer.disconnect()
  }, [])

  return theme
}
