import { useState, useRef, useCallback } from 'react'
import { Autocomplete } from './Autocomplete'
import styles from './AddBar.module.css'

export function AddBar({ onAdd, getSuggestions, pendingNames }) {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const inputRef = useRef(null)

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
    <div className={styles.bar}>
      <Autocomplete suggestions={suggestions} onSelect={handleSelect} />
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
    </div>
  )
}
