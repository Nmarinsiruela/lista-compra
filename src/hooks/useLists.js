import { useState, useEffect, useCallback, useMemo } from 'react'
import { normalize } from '../utils/text'
import { uid } from '../utils/id'
import { STORAGE_KEYS, loadJSON, saveJSON } from '../utils/storage'
import { useI18n } from '../i18n/I18nContext'

// Every item lives in one array and carries the id of the list it belongs to.
// Items saved before lists existed belong to this one.
export const DEFAULT_LIST_ID = 'default'
export const MAX_TITLE_LENGTH = 30

function cleanTitle(raw) {
  return raw.trim().replace(/\s+/g, ' ').slice(0, MAX_TITLE_LENGTH)
}

function loadLists(defaultTitle) {
  const stored = loadJSON(STORAGE_KEYS.lists, null)
  if (Array.isArray(stored) && stored.length) return stored
  return [{ id: DEFAULT_LIST_ID, title: defaultTitle, createdAt: Date.now() }]
}

export function useLists() {
  const { t } = useI18n()
  const [lists, setLists] = useState(() => loadLists(t('lists.defaultTitle')))
  const [activeId, setActiveId] = useState(() => loadJSON(STORAGE_KEYS.activeList, DEFAULT_LIST_ID))

  useEffect(() => saveJSON(STORAGE_KEYS.lists, lists), [lists])
  useEffect(() => saveJSON(STORAGE_KEYS.activeList, activeId), [activeId])

  // Falls back to the first list if the saved id no longer exists.
  const activeList = useMemo(() => lists.find((l) => l.id === activeId) ?? lists[0], [lists, activeId])

  // Titles are unique ignoring case and accents ("Fiesta" == "fiésta").
  const findByTitle = useCallback(
    (title) => lists.find((l) => normalize(l.title) === normalize(title)) ?? null,
    [lists],
  )

  const createList = useCallback(
    (rawTitle) => {
      const title = cleanTitle(rawTitle)
      if (!title) return { status: 'empty' }
      const existing = findByTitle(title)
      if (existing) return { status: 'duplicate', title: existing.title }

      const list = { id: uid(), title, createdAt: Date.now() }
      setLists((prev) => [...prev, list])
      setActiveId(list.id)
      return { status: 'created', list }
    },
    [findByTitle],
  )

  const renameList = useCallback(
    (id, rawTitle) => {
      const title = cleanTitle(rawTitle)
      if (!title) return { status: 'empty' }
      const existing = findByTitle(title)
      if (existing && existing.id !== id) return { status: 'duplicate', title: existing.title }

      setLists((prev) => prev.map((l) => (l.id === id ? { ...l, title } : l)))
      return { status: 'renamed', title }
    },
    [findByTitle],
  )

  // The last remaining list can't be deleted. Deleting the item rows is up to the caller.
  const deleteList = useCallback(
    (id) => {
      if (lists.length <= 1) return { status: 'last' }
      const remaining = lists.filter((l) => l.id !== id)
      setLists(remaining)
      if (activeList.id === id) setActiveId(remaining[0].id)
      return { status: 'deleted' }
    },
    [lists, activeList],
  )

  return { lists, activeList, selectList: setActiveId, findByTitle, createList, renameList, deleteList }
}
