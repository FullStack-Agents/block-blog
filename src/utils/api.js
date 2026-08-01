/**
 * API endpoint configuration for the Block Blog tech-support pages.
 *
 * The conversations archive is served by the tech-support-bot API.
 * During local development this defaults to localhost:3000.
 * For production (GitHub Pages) it should be pointed at the public proxy
 * that tunnels to the Raspberry Pi (e.g. a Wireguard-backed VPS endpoint).
 */

const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost'

export function getApiBaseUrl() {
  if (hostname === 'fullstack-agents.github.io') {
    // Placeholder — update once the Wireguard/VPS tunnel is in place.
    return 'http://localhost:3000'
  }

  return 'http://localhost:3000'
}
