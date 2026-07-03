import { useState } from 'react'
import { TagBadge } from './TagBadge'
import { TagPicker } from './TagPicker'
import styles from './ItemCard.module.css'

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,7 6,11 12,3" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19,6l-1,14H6L5,6" />
      <path d="M10,11v6M14,11v6" />
      <path d="M9,6V4h6v2" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

export function ItemCard({ item, onToggle, onDelete, allTags, getTag, onToggleItemTag, ensureTag }) {
  const [editing, setEditing] = useState(false)
  const badges = item.tags.map((key) => getTag(key)).filter(Boolean)

  const handleCreate = (name) => {
    const key = ensureTag(name)
    if (key) onToggleItemTag(item.id, key)
  }

  return (
    <div className={`${styles.card} ${item.done ? styles.done : ''}`}>
      <div className={styles.mainRow}>
        <button
          className={styles.checkBtn}
          onClick={() => onToggle(item.id)}
          aria-label={item.done ? 'Desmarcar' : 'Marcar como recogido'}
        >
          <div className={styles.circle}>
            {item.done && <CheckIcon />}
          </div>
        </button>

        <div className={styles.body} onClick={() => onToggle(item.id)}>
          <span className={styles.name}>{item.name}</span>
          {badges.length > 0 && (
            <div className={styles.badges}>
              {badges.map((tag) => (
                <TagBadge key={tag.key} tag={tag} />
              ))}
            </div>
          )}
        </div>

        <button
          className={`${styles.tagBtn} ${editing ? styles.tagBtnActive : ''}`}
          onClick={() => setEditing((v) => !v)}
          aria-label="Editar etiquetas"
          aria-expanded={editing}
        >
          <TagIcon />
        </button>

        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(item.id)}
          aria-label="Eliminar"
        >
          <TrashIcon />
        </button>
      </div>

      {editing && (
        <div className={styles.editor}>
          <TagPicker
            allTags={allTags}
            selected={item.tags}
            onToggle={(key) => onToggleItemTag(item.id, key)}
            onCreate={handleCreate}
          />
        </div>
      )}
    </div>
  )
}
