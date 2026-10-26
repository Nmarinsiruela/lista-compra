import { useCallback, useEffect, useRef } from 'react'
import { Header } from './components/Header'
import { ListTabs } from './components/ListTabs'
import { ItemList } from './components/ItemList'
import { AddBar } from './components/AddBar'
import { Toast } from './components/Toast'
import { useLists } from './hooks/useLists'
import { useShoppingList } from './hooks/useShoppingList'
import { useTags } from './hooks/useTags'
import { useToast } from './hooks/useToast'
import { useI18n } from './i18n/I18nContext'
import { buildShareUrl, consumeSharedList } from './utils/share'
import { EXTERNAL_TAG } from './utils/tags'
import styles from './App.module.css'

export default function App() {
  const { lists, activeList, selectList, findByTitle, createList, renameList, deleteList } = useLists()
  const { pending, done, pendingNames, counts, addItem, toggleItem, toggleItemTag, deleteItem, clearAll, emptyCart, importItems, removeListItems, getSuggestions, removeFromHistory } =
    useShoppingList(activeList.id)
  const { allTags, getTag } = useTags()
  const { message, visible, showToast } = useToast()
  const { t } = useI18n()
  const didImport = useRef(false)

  // Products arriving through a shared link get the "external" tag so they can be told apart.
  // They go into the list named in the link (created if needed), or the open list for older links.
  useEffect(() => {
    if (didImport.current) return
    didImport.current = true

    const { names, title } = consumeSharedList()
    if (!names.length) return

    let target = activeList
    if (title) {
      const existing = findByTitle(title)
      if (existing) {
        target = existing
        selectList(existing.id)
      } else {
        target = createList(title).list ?? activeList
      }
    }

    const { added } = importItems(names, [EXTERNAL_TAG], target.id)
    showToast(added > 0 ? t('toast.imported', { count: added, list: target.title }) : t('toast.allAlreadyInList'))
  }, [activeList, findByTitle, selectList, createList, importItems, showToast, t])

  const handleAdd = useCallback(
    (name, tags) => {
      const result = addItem(name, tags)
      if (result.status === 'added') showToast(t('toast.added', { name: result.name }))
      else if (result.status === 'duplicate') showToast(t('toast.alreadyInList', { name: result.name }))
    },
    [addItem, showToast, t],
  )

  const handleEmptyCart = useCallback(() => {
    const { count } = emptyCart()
    showToast(count === 0 ? t('toast.cartAlreadyEmpty') : t('toast.returnedToList', { count }))
  }, [emptyCart, showToast, t])

  const handleClearAll = useCallback(() => {
    const { count } = clearAll()
    showToast(count === 0 ? t('toast.listAlreadyEmpty') : t('toast.listCleared', { count }))
  }, [clearAll, showToast, t])

  const handleShare = useCallback(() => {
    if (!pending.length) {
      showToast(t('toast.nothingToShare'))
      return
    }
    const shareUrl = buildShareUrl(pendingNames, activeList.title)

    if (navigator.share) {
      // Rejects when the user dismisses the share sheet; nothing to do then.
      navigator.share({ title: activeList.title, url: shareUrl }).catch(() => {})
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => showToast(t('toast.linkCopied', { count: pending.length })))
        .catch(() => {})
    }
  }, [pending, pendingNames, activeList, showToast, t])

  // Returns whether the title was accepted, so the tab input knows whether to close.
  const handleListTitle = useCallback(
    (result) => {
      if (result.status === 'duplicate') showToast(t('toast.listExists', { title: result.title }))
      return result.status === 'created' || result.status === 'renamed'
    },
    [showToast, t],
  )

  const handleDeleteList = useCallback(
    (id) => {
      const list = lists.find((l) => l.id === id)
      const total = counts[id]?.total ?? 0
      if (!list || (total > 0 && !window.confirm(t('lists.confirmDelete', { title: list.title, count: total })))) return

      if (deleteList(id).status !== 'deleted') return
      removeListItems(id)
      showToast(t('toast.listDeleted', { title: list.title }))
    },
    [lists, counts, deleteList, removeListItems, showToast, t],
  )

  return (
    <>
      <Header
        pending={pending}
        done={done}
        onEmptyCart={handleEmptyCart}
        onClearAll={handleClearAll}
        onShare={handleShare}
      >
        <ListTabs
          lists={lists}
          activeId={activeList.id}
          counts={counts}
          onSelect={selectList}
          onCreate={(title) => handleListTitle(createList(title))}
          onRename={(id, title) => handleListTitle(renameList(id, title))}
          onDelete={handleDeleteList}
        />
      </Header>

      <main className={styles.main}>
        <ItemList
          pending={pending}
          done={done}
          onToggle={toggleItem}
          onDelete={deleteItem}
          allTags={allTags}
          getTag={getTag}
          onToggleItemTag={toggleItemTag}
        />
      </main>

      <AddBar
        onAdd={handleAdd}
        getSuggestions={getSuggestions}
        removeFromHistory={removeFromHistory}
        pendingNames={pendingNames}
        allTags={allTags}
      />

      <Toast message={message} visible={visible} />
    </>
  )
}
