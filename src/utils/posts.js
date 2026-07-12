import { useEffect, useState } from 'react'
import matter from 'gray-matter'

// Vite glob import — discovers all markdown files at build time
const postModules = import.meta.glob('/posts/*.md', { query: '?raw', import: 'default', eager: true })

export function getAllPosts() {
  const posts = Object.entries(postModules).map(([filepath, content]) => {
    const slug = filepath.replace('/posts/', '').replace('.md', '')
    const { data, content: body } = matter(content)
    return {
      slug,
      title: data.title || slug,
      date: data.date || null,
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      body,
    }
  })

  // Sort by date descending (newest first)
  return posts.sort((a, b) => {
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(b.date) - new Date(a.date)
  })
}

export function getPostBySlug(slug) {
  const posts = getAllPosts()
  return posts.find(p => p.slug === slug) || null
}