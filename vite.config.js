import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import blogPosts from './vite-plugin-blog-posts.js'

export default defineConfig({
  plugins: [react(), blogPosts()],
  base: '/block-blog/',
})