import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import matter from 'gray-matter'

/**
 * Vite plugin that reads the BCH Education lessons from the `education/`
 * directory and exposes them as a virtual module `virtual:education-lessons`.
 *
 * Each lesson file is markdown with YAML frontmatter:
 *   title, date, order, description, video (optional), tags (optional)
 */
export default function educationPlugin() {
  const virtualModuleId = 'virtual:education-lessons'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'education-lessons',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const lessonsDir = path.resolve('education')
        const files = glob.sync('*.md', { cwd: lessonsDir })

        const lessons = files.map((file) => {
          const raw = fs.readFileSync(path.join(lessonsDir, file), 'utf-8')
          const { data, content } = matter(raw)
          const slug = file.replace('.md', '')
          return {
            slug,
            title: data.title || slug,
            date: data.date || null,
            order: data.order != null ? data.order : Number.MAX_SAFE_INTEGER,
            description: data.description || '',
            section: data.section || null,
            source: data.source || null,
            video: data.video || null,
            image: data.image || null,
            tags: data.tags || [],
            body: content,
          }
        })

        // Sort by order (ascending), then by date descending.
        lessons.sort((a, b) => {
          if (a.order !== b.order) return a.order - b.order
          return new Date(b.date || 0) - new Date(a.date || 0)
        })

        return `export const lessons = ${JSON.stringify(lessons, null, 2)}`
      }
    },
  }
}
