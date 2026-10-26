import { useState, useRef, useEffect } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { MAX_TITLE_LENGTH } from '../hooks/useLists'
import styles from './ListTabs.module.css'

function PencilIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19,6l-1,14H6L5,6" />
      <path d="M9,6V4h6v2" />
    </svg>
  )
}

// One tab per list. Tapping the active tab renames (or deletes) it; "+" creates a new list.
// onCreate/onRename return true when the title was accepted.
export function ListTabs({ lists, activeId, counts, onSelect, onCreate, onRename, onDelete }) {
  const { t } = useI18n()
  const [editing, setEditing] = useState(null) // 'new', the id of the list being renamed, or null
  const [draft, setDraft] = useState('')
  // Mirrors `editing` synchronously so a blur fired after closing the input is ignored.
  const editingRef = useRef(null)
  const inputRef = useRef(null)
  const activeTabRef = useRef(null)

  useEffect(() => {
    const input = inputRef.current
    if (!editing || !input) return
    input.focus()
    // When renaming, the delete button sits after the input: bring it into view too.
    ;(input.nextElementSibling ?? input).scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  }, [editing])

  useEffect(() => {
    activeTabRef.current?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  }, [activeId])

  const startEditing = (target, title = '') => {
    editingRef.current = target
    setDraft(title)
    setEditing(target)
  }

  const stopEditing = () => {
    editingRef.current = null
    setEditing(null)
    setDraft('')
  }

  // On Enter a rejected title keeps the input open to fix it; on blur we close either way.
  const commit = (closeIfRejected) => {
    const target = editingRef.current
    if (!target) return
    const title = draft.trim()
    const accepted = title && (target === 'new' ? onCreate(title) : onRename(target, title))
    if (accepted || !title || closeIfRejected) stopEditing()
  }

  const input = (
    <input
      ref={inputRef}
      className={styles.input}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit(false)
        else if (e.key === 'Escape') stopEditing()
      }}
      onBlur={() => commit(true)}
      placeholder={t('lists.namePlaceholder')}
      aria-label={editing === 'new' ? t('lists.new') : t('lists.rename')}
      maxLength={MAX_TITLE_LENGTH}
      autoComplete="off"
      autoCapitalize="sentences"
      spellCheck={false}
      enterKeyHint="done"
    />
  )

  return (
    <nav className={styles.strip} aria-label={t('lists.label')}>
      {lists.map((list) => {
        const isActive = list.id === activeId

        if (editing === list.id) {
          return (
            <div key={list.id} className={styles.editor}>
              {input}
              {lists.length > 1 && (
                <button
                  type="button"
                  className={styles.deleteBtn}
                  aria-label={t('lists.delete')}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => {
                    stopEditing()
                    onDelete(list.id)
                  }}
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          )
        }

        const pendingCount = counts[list.id]?.pending ?? 0
        return (
          <button
            key={list.id}
            ref={isActive ? activeTabRef : null}
            type="button"
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            aria-pressed={isActive}
            title={isActive ? t('lists.editHint') : undefined}
            onClick={() => (isActive ? startEditing(list.id, list.title) : onSelect(list.id))}
          >
            <span className={styles.title}>{list.title}</span>
            {pendingCount > 0 && <span className={styles.count}>{pendingCount}</span>}
            {isActive && <PencilIcon />}
          </button>
        )
      })}

      {editing === 'new' ? (
        input
      ) : (
        <button type="button" className={styles.addBtn} aria-label={t('lists.new')} onClick={() => startEditing('new')}>
          +
        </button>
      )}
    </nav>
  )
}
