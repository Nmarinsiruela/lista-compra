import { useState, useCallback } from 'react'
import { useHistory } from './useHistory'

const STORAGE_KEY = 'compra_lista'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

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

function loadList() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    // Migrate items saved before tags existed.
    return raw.map((i) => (Array.isArray(i.tags) ? i : { ...i, tags: [] }))
  } catch {
    return []
  }
}

function persistList(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function useShoppingList() {
  const [list, setList] = useState(loadList)
  const { addToHistory, getSuggestions } = useHistory()

  const updateList = useCallback((updater) => {
    setList((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      persistList(next)
      return next
    })
  }, [])

  const addItem = useCallback(
    (rawName, tags = []) => {
      const name = rawName.trim()
      if (!name) return { ok: false, message: '' }

      const norm = normalize(name)
      const existing = list.find((i) => normalize(i.name) === norm && !i.done)
      if (existing) {
        return { ok: false, message: `"${existing.name}" ya está en la lista` }
      }

      const item = {
        id: uid(),
        name: capitalize(name),
        done: false,
        addedAt: Date.now(),
        tags: [...new Set(tags)],
      }
      updateList((prev) => [item, ...prev])
      addToHistory(name)
      return { ok: true, message: `"${item.name}" añadido` }
    },
    [list, updateList, addToHistory],
  )

  const toggleItemTag = useCallback(
    (id, tagKey) => {
      updateList((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item
          const has = item.tags.includes(tagKey)
          return {
            ...item,
            tags: has ? item.tags.filter((t) => t !== tagKey) : [...item.tags, tagKey],
          }
        }),
      )
    },
    [updateList],
  )

  const purgeTag = useCallback(
    (tagKey) => {
      updateList((prev) =>
        prev.map((item) =>
          item.tags.includes(tagKey) ? { ...item, tags: item.tags.filter((t) => t !== tagKey) } : item,
        ),
      )
    },
    [updateList],
  )

  const toggleItem = useCallback(
    (id) => {
      updateList((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item
          if (!item.done) addToHistory(item.name) // reinforce on check-off
          return { ...item, done: !item.done }
        }),
      )
    },
    [updateList, addToHistory],
  )

  const deleteItem = useCallback(
    (id) => {
      updateList((prev) => prev.filter((i) => i.id !== id))
    },
    [updateList],
  )

  const clearDone = useCallback(() => {
    const doneCount = list.filter((i) => i.done).length
    if (!doneCount) return { count: 0 }
    updateList((prev) => prev.filter((i) => !i.done))
    return { count: doneCount }
  }, [list, updateList])

  const emptyCart = useCallback(() => {
    const doneCount = list.filter((i) => i.done).length
    if (!doneCount) return { count: 0 }
    updateList((prev) => prev.map((i) => (i.done ? { ...i, done: false } : i)))
    return { count: doneCount }
  }, [list, updateList])

  const importItems = useCallback((names) => {
    const existingNorms = new Set(list.map((i) => normalize(i.name)))
    const toAdd = []
    for (const rawName of names) {
      const name = rawName?.trim()
      if (!name) continue
      const norm = normalize(name)
      if (existingNorms.has(norm)) continue
      existingNorms.add(norm)
      toAdd.push({ id: uid(), name: capitalize(name), done: false, addedAt: Date.now(), tags: [] })
    }
    if (toAdd.length > 0) updateList((prev) => [...toAdd, ...prev])
    return { added: toAdd.length }
  }, [list, updateList])

  const clearAll = useCallback(() => {
    const total = list.length
    if (!total) return { count: 0 }
    updateList([])
    return { count: total }
  }, [list, updateList])

  const pendingNames = list.filter((i) => !i.done).map((i) => i.name)
  const pending = list.filter((i) => !i.done)
  const done = list.filter((i) => i.done)

  return {
    list,
    pending,
    done,
    pendingNames,
    addItem,
    toggleItem,
    toggleItemTag,
    purgeTag,
    deleteItem,
    clearDone,
    clearAll,
    emptyCart,
    importItems,
    getSuggestions,
  }
}
