/**
 * API endpoint configuration for the Block Blog tech-support pages.
 *
 * The conversations archive is served by the tech-support-bot API.
 * During local development this defaults to localhost:3000.
 * For production (GitHub Pages) it uses the public proxy that tunnels to
 * the Raspberry Pi.
 */

const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost'

export function getApiBaseUrl() {
  // Production / GitHub Pages
  if (hostname === 'fullstack-agents.github.io') {
    return 'https://ai-chat.fullstackcash.net'
  }

  // Local development
  return 'http://localhost:3000'
}
