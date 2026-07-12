import { posts as allPosts } from 'virtual:blog-posts'

export function getAllPosts() {
  return allPosts
}

export function getPostBySlug(slug) {
  return allPosts.find(p => p.slug === slug) || null
}