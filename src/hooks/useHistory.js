import { useState, useCallback } from 'react'

const STORAGE_KEY = 'compra_historial'

function normalize(str) {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

export function useHistory() {
  const [history, setHistory] = useState(loadHistory)

  const addToHistory = useCallback((name) => {
    const key = normalize(name)
    const display = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase()

    setHistory((prev) => {
      const entry = prev[key] || { name: display, count: 0, lastAdded: 0 }
      const updated = {
        ...prev,
        [key]: { name: display, count: entry.count + 1, lastAdded: Date.now() },
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const getSuggestions = useCallback(
    (query, pendingNames) => {
      const q = normalize(query)
      if (!q) return []

      const pendingSet = new Set(pendingNames.map(normalize))

      return Object.entries(history)
        .filter(([key]) => key.includes(q) && !pendingSet.has(key))
        .sort((a, b) => {
          const aStarts = a[0].startsWith(q)
          const bStarts = b[0].startsWith(q)
          if (aStarts !== bStarts) return aStarts ? -1 : 1
          return b[1].count - a[1].count
        })
        .slice(0, 6)
        .map(([, val]) => val)
    },
    [history],
  )

  return { addToHistory, getSuggestions }
}
