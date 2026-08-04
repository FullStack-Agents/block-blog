import { lessons as allLessons } from 'virtual:education-lessons'

export function getAllLessons() {
  return allLessons
}

export function getLessonBySlug(slug) {
  return allLessons.find((l) => l.slug === slug) || null
}
