import styles from './Header.module.css'

export function Header({ pending, done, onClearAll, onEmptyCart }) {
  const total = pending.length + done.length
  const statsText = total === 0
    ? 'Lista vacía'
    : `${done.length} de ${total} recogido${total !== 1 ? 's' : ''}`

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
    </header>
  )
}
