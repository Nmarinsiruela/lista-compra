import { useCallback } from 'react'
import { Header } from './components/Header'
import { ItemList } from './components/ItemList'
import { AddBar } from './components/AddBar'
import { Toast, useToast } from './components/Toast'
import { useShoppingList } from './hooks/useShoppingList'
import styles from './App.module.css'

export default function App() {
  const { pending, done, pendingNames, addItem, toggleItem, deleteItem, clearAll, emptyCart, getSuggestions } =
    useShoppingList()
  const { message, visible, showToast } = useToast()

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

  return (
    <>
      <Header
        pending={pending}
        done={done}
        onEmptyCart={handleEmptyCart}
        onClearAll={handleClearAll}
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
