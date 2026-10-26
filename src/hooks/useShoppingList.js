import { useState, useEffect, useCallback, useMemo } from 'react'
import { useHistory } from './useHistory'
import { DEFAULT_LIST_ID } from './useLists'
import { normalize, capitalize } from '../utils/text'
import { uid } from '../utils/id'
import { STORAGE_KEYS, loadJSON, saveJSON } from '../utils/storage'
import { migrateTags } from '../utils/tags'

function createItem(name, listId, tags = []) {
  return { id: uid(), listId, name: capitalize(name), done: false, addedAt: Date.now(), tags: [...new Set(tags)] }
}

function loadItems() {
  // Migrate items saved before lists or tags existed, or with free-text tags from earlier versions.
  return loadJSON(STORAGE_KEYS.list, []).map((i) => ({
    ...i,
    listId: i.listId ?? DEFAULT_LIST_ID,
    tags: Array.isArray(i.tags) ? migrateTags(i.tags) : [],
  }))
}

// All items live in one array; `listId` picks the list whose items are shown and edited.
export function useShoppingList(listId = DEFAULT_LIST_ID) {
  const [items, setItems] = useState(loadItems)
  const { addToHistory, removeFromHistory, getSuggestions } = useHistory()

  useEffect(() => saveJSON(STORAGE_KEYS.list, items), [items])

  // Returns a status instead of a message so the UI can word it in the active language.
  const addItem = useCallback(
    (rawName, tags = []) => {
      const name = rawName.trim()
      if (!name) return { ok: false, status: 'empty' }

      const norm = normalize(name)
      const existing = items.find((i) => i.listId === listId && normalize(i.name) === norm && !i.done)
      if (existing) return { ok: false, status: 'duplicate', name: existing.name }

      const item = createItem(name, listId, tags)
      setItems((prev) => [item, ...prev])
      addToHistory(name)
      return { ok: true, status: 'added', name: item.name }
    },
    [items, listId, addToHistory],
  )

  const toggleItemTag = useCallback((id, tagKey) => {
    setItems((prev) =>
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
      const item = items.find((i) => i.id === id)
      if (!item) return
      if (!item.done) addToHistory(item.name) // reinforce on check-off
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))
    },
    [items, addToHistory],
  )

  const deleteItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const emptyCart = useCallback(() => {
    const doneCount = items.filter((i) => i.listId === listId && i.done).length
    if (doneCount) {
      setItems((prev) => prev.map((i) => (i.listId === listId && i.done ? { ...i, done: false } : i)))
    }
    return { count: doneCount }
  }, [items, listId])

  const importItems = useCallback(
    (names, tags = [], targetListId = listId) => {
      const existingNorms = new Set(items.filter((i) => i.listId === targetListId).map((i) => normalize(i.name)))
      const toAdd = []
      for (const rawName of names) {
        const name = rawName?.trim()
        if (!name) continue
        const norm = normalize(name)
        if (existingNorms.has(norm)) continue
        existingNorms.add(norm)
        toAdd.push(createItem(name, targetListId, tags))
      }
      if (toAdd.length > 0) setItems((prev) => [...toAdd, ...prev])
      return { added: toAdd.length }
    },
    [items, listId],
  )

  const clearAll = useCallback(() => {
    const total = items.filter((i) => i.listId === listId).length
    if (total) setItems((prev) => prev.filter((i) => i.listId !== listId))
    return { count: total }
  }, [items, listId])

  // Used when a whole list is deleted.
  const removeListItems = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.listId !== id))
  }, [])

  const { pending, done, pendingNames, counts } = useMemo(() => {
    const counts = {}
    for (const i of items) {
      const c = (counts[i.listId] ??= { pending: 0, total: 0 })
      c.total++
      if (!i.done) c.pending++
    }
    const current = items.filter((i) => i.listId === listId)
    const pending = current.filter((i) => !i.done)
    return {
      pending,
      done: current.filter((i) => i.done),
      pendingNames: pending.map((i) => i.name),
      counts,
    }
  }, [items, listId])

  return {
    items,
    pending,
    done,
    pendingNames,
    counts,
    addItem,
    toggleItem,
    toggleItemTag,
    deleteItem,
    clearAll,
    emptyCart,
    importItems,
    removeListItems,
    getSuggestions,
    removeFromHistory,
  }
}
