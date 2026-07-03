import { useState, useRef, useCallback } from 'react'
import styles from './TagPicker.module.css'

export function TagPicker({ allTags, selected, onToggle, onCreate }) {
  const [creating, setCreating] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef(null)
  const selectedSet = new Set(selected)

  const startCreating = useCallback(() => {
    setCreating(true)
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  const commit = useCallback(() => {
    const name = value.trim()
    if (name) onCreate(name)
    setValue('')
    setCreating(false)
  }, [value, onCreate])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') commit()
      else if (e.key === 'Escape') {
        setValue('')
        setCreating(false)
      }
    },
    [commit],
  )

  return (
    <div className={styles.picker}>
      {allTags.map((tag) => {
        const isOn = selectedSet.has(tag.key)
        return (
          <button
            key={tag.key}
            type="button"
            className={`${styles.chip} ${isOn ? styles.on : ''}`}
            style={{ '--tag-color': tag.color }}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => onToggle(tag.key)}
            aria-pressed={isOn}
          >
            {tag.name}
          </button>
        )
      })}

      {creating ? (
        <input
          ref={inputRef}
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          placeholder="Nueva etiqueta…"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={20}
        />
      ) : (
        <button
          type="button"
          className={styles.addChip}
          onPointerDown={(e) => e.preventDefault()}
          onClick={startCreating}
        >
          + Etiqueta
        </button>
      )}
    </div>
  )
}
