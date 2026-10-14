import { posts as allAgentLifePosts } from 'virtual:agent-life-posts'

export function getAllAgentLifePosts() {
  return allAgentLifePosts
}

export function getAgentLifePostBySlug(slug) {
  return allAgentLifePosts.find(p => p.slug === slug) || null
}
