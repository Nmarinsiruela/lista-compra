import { ItemCard } from './ItemCard'
import styles from './ItemList.module.css'

function EmptyState() {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>🛍️</div>
      <p>Tu lista está vacía</p>
      <small>Empieza añadiendo productos arriba</small>
    </div>
  )
}

export function ItemList({ pending, done, onToggle, onDelete }) {
  if (!pending.length && !done.length) return <EmptyState />

  return (
    <div className={styles.container}>
      {pending.length > 0 && (
        <section>
          <h2 className={styles.sectionLabel}>Por comprar ({pending.length})</h2>
          {pending.map((item) => (
            <ItemCard key={item.id} item={item} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </section>
      )}

      {done.length > 0 && (
        <section className={styles.doneSection}>
          <h2 className={styles.sectionLabel}>En el carro ({done.length})</h2>
          {done.map((item) => (
            <ItemCard key={item.id} item={item} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </section>
      )}
    </div>
  )
}
