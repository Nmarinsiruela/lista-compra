import { useState, useRef, useCallback } from 'react'
import { Autocomplete } from './Autocomplete'
import { TagPicker } from './TagPicker'
import styles from './AddBar.module.css'

export function AddBar({ onAdd, getSuggestions, removeFromHistory, pendingNames, allTags, ensureTag }) {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [activeTags, setActiveTags] = useState([])
  const inputRef = useRef(null)

  const handleChange = useCallback((e) => {
    const v = e.target.value
    setValue(v)
    setSuggestions(v.trim() ? getSuggestions(v, pendingNames) : [])
  }, [getSuggestions, pendingNames])

  const submit = useCallback(() => {
    if (!value.trim()) return
    onAdd(value, activeTags)
    setValue('')
    setSuggestions([])
  }, [value, onAdd, activeTags])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') submit()
  }, [submit])

  const handleSelect = useCallback((name) => {
    onAdd(name, activeTags)
    setValue('')
    setSuggestions([])
    inputRef.current?.focus()
  }, [onAdd, activeTags])

  const handleDeleteSuggestion = useCallback((name) => {
    removeFromHistory(name)
    setSuggestions((prev) => prev.filter((s) => s.name !== name))
    inputRef.current?.focus()
  }, [removeFromHistory])

  const handleBlur = useCallback(() => {
    setTimeout(() => setSuggestions([]), 150)
  }, [])

  const handleFocus = useCallback(() => {
    if (value.trim()) setSuggestions(getSuggestions(value, pendingNames))
  }, [value, getSuggestions, pendingNames])

  const toggleActive = useCallback((key) => {
    setActiveTags((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }, [])

  const handleCreate = useCallback((name) => {
    const key = ensureTag(name)
    if (key) setActiveTags((prev) => (prev.includes(key) ? prev : [...prev, key]))
  }, [ensureTag])

  return (
    <div className={styles.bar}>
      <Autocomplete suggestions={suggestions} onSelect={handleSelect} onDelete={handleDeleteSuggestion} />
      <div className={styles.tagRow}>
        <TagPicker
          allTags={allTags}
          selected={activeTags}
          onToggle={toggleActive}
          onCreate={handleCreate}
        />
      </div>
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
