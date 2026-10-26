import { useCallback, useEffect, useRef } from 'react'
import { Header } from './components/Header'
import { ItemList } from './components/ItemList'
import { AddBar } from './components/AddBar'
import { Toast } from './components/Toast'
import { useShoppingList } from './hooks/useShoppingList'
import { useTags } from './hooks/useTags'
import { useToast } from './hooks/useToast'
import { useI18n } from './i18n/I18nContext'
import { buildShareUrl, consumeSharedNames } from './utils/share'
import { EXTERNAL_TAG } from './utils/tags'
import styles from './App.module.css'

export default function App() {
  const { pending, done, pendingNames, addItem, toggleItem, toggleItemTag, deleteItem, clearAll, emptyCart, importItems, getSuggestions, removeFromHistory } =
    useShoppingList()
  const { allTags, getTag } = useTags()
  const { message, visible, showToast } = useToast()
  const { t } = useI18n()
  const didImport = useRef(false)

  // Products arriving through a shared link get the "external" tag so they can be told apart.
  useEffect(() => {
    if (didImport.current) return
    didImport.current = true

    const names = consumeSharedNames()
    if (!names.length) return

    const { added } = importItems(names, [EXTERNAL_TAG])
    showToast(added > 0 ? t('toast.imported', { count: added }) : t('toast.allAlreadyInList'))
  }, [importItems, showToast, t])

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
    const shareUrl = buildShareUrl(pendingNames)

    if (navigator.share) {
      // Rejects when the user dismisses the share sheet; nothing to do then.
      navigator.share({ title: t('share.title'), url: shareUrl }).catch(() => {})
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => showToast(t('toast.linkCopied', { count: pending.length })))
        .catch(() => {})
    }
  }, [pending, pendingNames, showToast, t])

  return (
    <>
      <Header
        pending={pending}
        done={done}
        onEmptyCart={handleEmptyCart}
        onClearAll={handleClearAll}
        onShare={handleShare}
      />

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
