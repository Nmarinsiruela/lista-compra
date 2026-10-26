import { useState, useRef, useCallback, useMemo } from 'react'
import { Autocomplete } from './Autocomplete'
import { TagPicker } from './TagPicker'
import { useI18n } from '../i18n/I18nContext'
import styles from './AddBar.module.css'

export function AddBar({ onAdd, getSuggestions, removeFromHistory, pendingNames, allTags }) {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [activeTags, setActiveTags] = useState([])
  const inputRef = useRef(null)
  const { t } = useI18n()
  // System tags (e.g. "External") are assigned by the app, so they aren't offered when adding by hand.
  const userTags = useMemo(() => allTags.filter((tag) => !tag.system), [allTags])

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

  return (
    <div className={styles.bar}>
      <Autocomplete suggestions={suggestions} onSelect={handleSelect} onDelete={handleDeleteSuggestion} />
      <div className={styles.tagRow}>
        <TagPicker
          allTags={userTags}
          selected={activeTags}
          onToggle={toggleActive}
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
          placeholder={t('addBar.placeholder')}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck={false}
          enterKeyHint="done"
        />
        <button className={styles.addBtn} onClick={submit} aria-label={t('addBar.add')}>
          +
        </button>
      </div>
    </div>
  )
}
