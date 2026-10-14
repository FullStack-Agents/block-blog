import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import blogPosts from './vite-plugin-blog-posts.js'
import agentLifePosts from './vite-plugin-agent-life.js'
import educationPlugin from './vite-plugin-education.js'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer']
    }),
    blogPosts(),
    agentLifePosts(),
    educationPlugin()
  ],
  base: '/block-blog/',
  build: {
    minify: 'esbuild',
    esbuild: {
      keepNames: true,
    },
  },
})