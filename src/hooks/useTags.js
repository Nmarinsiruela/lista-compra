import { useState, useCallback } from 'react'

const STORAGE_KEY = 'compra_tags'

// Palette used to auto-assign a colour to each new tag. Greens are avoided so
// tags never clash with the app's primary green.
const PALETTE = [
  '#2563eb', '#db2777', '#d97706', '#7c3aed',
  '#0891b2', '#dc2626', '#4f46e5', '#ca8a04',
  '#be185d', '#0369a1',
]

function normalize(str) {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function capitalize(str) {
  const s = str.trim()
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

function loadTags() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function persist(tags) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tags))
}

export function useTags() {
  const [tags, setTags] = useState(loadTags)

  // Creates the tag if it doesn't exist yet and returns its normalized key.
  const ensureTag = useCallback((rawName) => {
    const key = normalize(rawName)
    if (!key) return null

    setTags((prev) => {
      if (prev[key]) return prev
      const used = new Set(Object.values(prev).map((t) => t.color))
      const color =
        PALETTE.find((c) => !used.has(c)) || PALETTE[Object.keys(prev).length % PALETTE.length]
      const next = { ...prev, [key]: { name: capitalize(rawName), color } }
      persist(next)
      return next
    })

    return key
  }, [])

  const removeTag = useCallback((key) => {
    setTags((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      persist(next)
      return next
    })
  }, [])

  const getTag = useCallback((key) => tags[key] || null, [tags])

  const allTags = Object.entries(tags)
    .map(([key, t]) => ({ key, name: t.name, color: t.color }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))

  return { allTags, ensureTag, removeTag, getTag }
}
