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

export function ItemCard({ item, onToggle, onDelete }) {
  return (
    <div className={`${styles.card} ${item.done ? styles.done : ''}`}>
      <button
        className={styles.checkBtn}
        onClick={() => onToggle(item.id)}
        aria-label={item.done ? 'Desmarcar' : 'Marcar como recogido'}
      >
        <div className={styles.circle}>
          {item.done && <CheckIcon />}
        </div>
      </button>

      <span className={styles.name} onClick={() => onToggle(item.id)}>{item.name}</span>

      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(item.id)}
        aria-label="Eliminar"
      >
        <TrashIcon />
      </button>
    </div>
  )
}
