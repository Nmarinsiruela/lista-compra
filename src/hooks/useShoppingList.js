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
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
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
    (rawName) => {
      const name = rawName.trim()
      if (!name) return { ok: false, message: '' }

      const norm = normalize(name)
      const existing = list.find((i) => normalize(i.name) === norm && !i.done)
      if (existing) {
        return { ok: false, message: `"${existing.name}" ya está en la lista` }
      }

      const item = { id: uid(), name: capitalize(name), done: false, addedAt: Date.now() }
      updateList((prev) => [item, ...prev])
      addToHistory(name)
      return { ok: true, message: `"${item.name}" añadido` }
    },
    [list, updateList, addToHistory],
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
    deleteItem,
    clearDone,
    clearAll,
    emptyCart,
    getSuggestions,
  }
}
