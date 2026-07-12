import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import matter from 'gray-matter'

export default function blogPostsPlugin() {
  const virtualModuleId = 'virtual:blog-posts'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'blog-posts', // required name
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const postsDir = path.resolve('posts')
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
            body: content,
          }
        })

        // Sort by date descending
        posts.sort((a, b) => {
          if (!a.date) return 1
          if (!b.date) return -1
          return new Date(b.date) - new Date(a.date)
        })

        // Export as JSON
        return `export const posts = ${JSON.stringify(posts, null, 2)}`
      }
    },
  }
}