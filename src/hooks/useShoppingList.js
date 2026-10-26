import { useState, useEffect, useCallback, useMemo } from 'react'
import { useHistory } from './useHistory'
import { normalize, capitalize } from '../utils/text'
import { STORAGE_KEYS, loadJSON, saveJSON } from '../utils/storage'
import { migrateTags } from '../utils/tags'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function createItem(name, tags = []) {
  return { id: uid(), name: capitalize(name), done: false, addedAt: Date.now(), tags: [...new Set(tags)] }
}

function loadList() {
  // Migrate items saved before tags existed, or with free-text tags from earlier versions.
  return loadJSON(STORAGE_KEYS.list, []).map((i) => ({ ...i, tags: Array.isArray(i.tags) ? migrateTags(i.tags) : [] }))
}

export function useShoppingList() {
  const [list, setList] = useState(loadList)
  const { addToHistory, removeFromHistory, getSuggestions } = useHistory()

  useEffect(() => saveJSON(STORAGE_KEYS.list, list), [list])

  // Returns a status instead of a message so the UI can word it in the active language.
  const addItem = useCallback(
    (rawName, tags = []) => {
      const name = rawName.trim()
      if (!name) return { ok: false, status: 'empty' }

      const norm = normalize(name)
      const existing = list.find((i) => normalize(i.name) === norm && !i.done)
      if (existing) return { ok: false, status: 'duplicate', name: existing.name }

      const item = createItem(name, tags)
      setList((prev) => [item, ...prev])
      addToHistory(name)
      return { ok: true, status: 'added', name: item.name }
    },
    [list, addToHistory],
  )

  const toggleItemTag = useCallback((id, tagKey) => {
    setList((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const has = item.tags.includes(tagKey)
        return {
          ...item,
          tags: has ? item.tags.filter((t) => t !== tagKey) : [...item.tags, tagKey],
        }
      }),
    )
  }, [])

  const toggleItem = useCallback(
    (id) => {
      const item = list.find((i) => i.id === id)
      if (!item) return
      if (!item.done) addToHistory(item.name) // reinforce on check-off
      setList((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))
    },
    [list, addToHistory],
  )

  const deleteItem = useCallback((id) => {
    setList((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const emptyCart = useCallback(() => {
    const doneCount = list.filter((i) => i.done).length
    if (doneCount) setList((prev) => prev.map((i) => (i.done ? { ...i, done: false } : i)))
    return { count: doneCount }
  }, [list])

  const importItems = useCallback(
    (names, tags = []) => {
      const existingNorms = new Set(list.map((i) => normalize(i.name)))
      const toAdd = []
      for (const rawName of names) {
        const name = rawName?.trim()
        if (!name) continue
        const norm = normalize(name)
        if (existingNorms.has(norm)) continue
        existingNorms.add(norm)
        toAdd.push(createItem(name, tags))
      }
      if (toAdd.length > 0) setList((prev) => [...toAdd, ...prev])
      return { added: toAdd.length }
    },
    [list],
  )

  const clearAll = useCallback(() => {
    const total = list.length
    if (total) setList([])
    return { count: total }
  }, [list])

  const { pending, done, pendingNames } = useMemo(() => {
    const pending = list.filter((i) => !i.done)
    return {
      pending,
      done: list.filter((i) => i.done),
      pendingNames: pending.map((i) => i.name),
    }
  }, [list])

  return {
    list,
    pending,
    done,
    pendingNames,
    addItem,
    toggleItem,
    toggleItemTag,
    deleteItem,
    clearAll,
    emptyCart,
    importItems,
    getSuggestions,
    removeFromHistory,
  }
}
