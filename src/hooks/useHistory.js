import { useState, useEffect, useCallback } from 'react'
import { normalize, capitalize } from '../utils/text'
import { STORAGE_KEYS, loadJSON, saveJSON } from '../utils/storage'

export function useHistory() {
  const [history, setHistory] = useState(() => loadJSON(STORAGE_KEYS.history, {}))

  useEffect(() => saveJSON(STORAGE_KEYS.history, history), [history])

  const addToHistory = useCallback((name) => {
    const key = normalize(name)
    const display = capitalize(name)

    setHistory((prev) => ({
      ...prev,
      [key]: { name: display, count: (prev[key]?.count ?? 0) + 1, lastAdded: Date.now() },
    }))
  }, [])

  const removeFromHistory = useCallback((name) => {
    const key = normalize(name)
    setHistory((prev) => {
      if (!prev[key]) return prev
      const updated = { ...prev }
      delete updated[key]
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

  return { addToHistory, removeFromHistory, getSuggestions }
}
