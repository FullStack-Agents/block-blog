import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import matter from 'gray-matter'

// Build-time loader for the Agent Life posts. This mirrors
// vite-plugin-blog-posts.js but reads from the `agent-life/` directory so the
// Agent Life section is a separate blog with its own feed, routes and images.
export default function agentLifePostsPlugin() {
  const virtualModuleId = 'virtual:agent-life-posts'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'agent-life-posts',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const postsDir = path.resolve('agent-life')
        const files = glob.sync('*.md', { cwd: postsDir })

        const posts = files.map((file) => {
          const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8')
          const { data, content } = matter(raw)
          const slug = file.replace('.md', '')
          return {
            slug,
            title: data.title || slug,
            date: data.date || null,
            excerpt: data.excerpt || '',
            tags: data.tags || [],
            image: data.image || null,
            body: content,
          }
        })

        // Sort by date descending
        posts.sort((a, b) => {
          if (!a.date) return 1
          if (!b.date) return -1
          return new Date(b.date) - new Date(a.date)
        })

        return `export const posts = ${JSON.stringify(posts, null, 2)}`
      }
    },
  }
}
