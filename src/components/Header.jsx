import { useState, useRef, useCallback } from 'react'
import { Autocomplete } from './Autocomplete'
import styles from './Header.module.css'

export function Header({ pending, done, onAdd, onClearAll, onEmptyCart, getSuggestions, pendingNames }) {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const inputRef = useRef(null)

  const total = pending.length + done.length
  const statsText = total === 0
    ? 'Lista vacía'
    : `${done.length} de ${total} recogido${total !== 1 ? 's' : ''}`

  const handleChange = useCallback((e) => {
    const v = e.target.value
    setValue(v)
    setSuggestions(v.trim() ? getSuggestions(v, pendingNames) : [])
  }, [getSuggestions, pendingNames])

  const submit = useCallback(() => {
    if (!value.trim()) return
    onAdd(value)
    setValue('')
    setSuggestions([])
  }, [value, onAdd])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') submit()
  }, [submit])

  const handleSelect = useCallback((name) => {
    onAdd(name)
    setValue('')
    setSuggestions([])
    inputRef.current?.focus()
  }, [onAdd])

  const handleBlur = useCallback(() => {
    setTimeout(() => setSuggestions([]), 150)
  }, [])

  const handleFocus = useCallback(() => {
    if (value.trim()) setSuggestions(getSuggestions(value, pendingNames))
  }, [value, getSuggestions, pendingNames])

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <div>
          <h1 className={styles.title}>🛒 Lista</h1>
          <p className={styles.stats}>{statsText}</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.clearAllBtn} onClick={onEmptyCart}>
            Vaciar carro
          </button>
          <button className={styles.clearAllBtn} onClick={onClearAll}>
            Limpiar todo
          </button>
        </div>
      </div>

      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder="Añadir producto..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="sentences"
            spellCheck={false}
            enterKeyHint="done"
          />
          <button className={styles.addBtn} onClick={submit} aria-label="Añadir">
            +
          </button>
        </div>

        <Autocomplete suggestions={suggestions} onSelect={handleSelect} />
      </div>
    </header>
  )
}
