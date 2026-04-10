import { useCallback, useEffect, useRef } from 'react'
import { Header } from './components/Header'
import { ItemList } from './components/ItemList'
import { AddBar } from './components/AddBar'
import { Toast, useToast } from './components/Toast'
import { useShoppingList } from './hooks/useShoppingList'
import styles from './App.module.css'

export default function App() {
  const { pending, done, pendingNames, addItem, toggleItem, deleteItem, clearAll, emptyCart, importItems, getSuggestions } =
    useShoppingList()
  const { message, visible, showToast } = useToast()
  const didImport = useRef(false)

  useEffect(() => {
    if (didImport.current) return
    didImport.current = true

    const params = new URLSearchParams(window.location.search)
    const raw = params.get('share')
    if (!raw) return

    try {
      const names = JSON.parse(raw)
      if (Array.isArray(names) && names.length > 0) {
        const result = importItems(names)
        if (result.added > 0) {
          showToast(`${result.added} producto${result.added !== 1 ? 's' : ''} importado${result.added !== 1 ? 's' : ''}`)
        } else {
          showToast('Todos los productos ya están en tu lista')
        }
      }
    } catch {}

    const clean = new URL(window.location.href)
    clean.searchParams.delete('share')
    window.history.replaceState({}, '', clean)
  }, [importItems, showToast])

  const handleAdd = useCallback(
    (name) => {
      const result = addItem(name)
      if (result.message) showToast(result.message)
    },
    [addItem, showToast],
  )

  const handleEmptyCart = useCallback(() => {
    const result = emptyCart()
    if (result.count === 0) {
      showToast('El carro ya está vacío')
    } else {
      showToast(`${result.count} producto${result.count > 1 ? 's' : ''} devuelto${result.count > 1 ? 's' : ''} a la lista`)
    }
  }, [emptyCart, showToast])

  const handleClearAll = useCallback(() => {
    const result = clearAll()
    if (result.count === 0) {
      showToast('La lista ya está vacía')
    } else {
      showToast(`Lista borrada (${result.count} producto${result.count > 1 ? 's' : ''})`)
    }
  }, [clearAll, showToast])

  const handleShare = useCallback(() => {
    if (!pending.length) {
      showToast('No hay productos pendientes')
      return
    }
    const url = new URL(window.location.href)
    url.searchParams.set('share', JSON.stringify(pending.map((i) => i.name)))
    const shareUrl = url.toString()

    if (navigator.share) {
      navigator.share({ title: 'Lista de la compra', url: shareUrl })
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast(`Enlace copiado (${pending.length} producto${pending.length !== 1 ? 's' : ''})`)
      })
    }
  }, [pending, showToast])

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
        />
      </main>

      <AddBar
        onAdd={handleAdd}
        getSuggestions={getSuggestions}
        pendingNames={pendingNames}
      />

      <Toast message={message} visible={visible} />
    </>
  )
}
