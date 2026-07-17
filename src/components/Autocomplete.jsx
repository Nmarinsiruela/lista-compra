import styles from './Autocomplete.module.css'

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19,6l-1,14H6L5,6" />
      <path d="M10,11v6M14,11v6" />
      <path d="M9,6V4h6v2" />
    </svg>
  )
}

export function Autocomplete({ suggestions, onSelect, onDelete }) {
  if (!suggestions.length) return null

  return (
    <ul className={styles.dropdown} role="listbox">
      {suggestions.map((s) => (
        <li
          key={s.name}
          className={styles.item}
          role="option"
          onPointerDown={(e) => {
            e.preventDefault()
            onSelect(s.name)
          }}
        >
          <span className={styles.icon}>🏷️</span>
          <span className={styles.name}>{s.name}</span>
          <span className={styles.freq}>{s.count}×</span>
          <button
            className={styles.deleteBtn}
            aria-label={`Eliminar "${s.name}" del historial`}
            onPointerDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete(s.name)
            }}
          >
            <TrashIcon />
          </button>
        </li>
      ))}
    </ul>
  )
}
