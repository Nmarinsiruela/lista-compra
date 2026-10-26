import { ItemCard } from './ItemCard'
import { useI18n } from '../i18n/I18nContext'
import styles from './ItemList.module.css'

function EmptyState() {
  const { t } = useI18n()
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>🛍️</div>
      <p>{t('list.emptyTitle')}</p>
      <small>{t('list.emptyHint')}</small>
    </div>
  )
}

export function ItemList({ pending, done, onToggle, onDelete, allTags, getTag, onToggleItemTag }) {
  const { t } = useI18n()
  if (!pending.length && !done.length) return <EmptyState />

  const cardProps = { onToggle, onDelete, allTags, getTag, onToggleItemTag }

  return (
    <div className={styles.container}>
      {pending.length > 0 && (
        <section>
          <h2 className={styles.sectionLabel}>{t('list.pending', { count: pending.length })}</h2>
          {pending.map((item) => (
            <ItemCard key={item.id} item={item} {...cardProps} />
          ))}
        </section>
      )}

      {done.length > 0 && (
        <section className={styles.doneSection}>
          <h2 className={styles.sectionLabel}>{t('list.done', { count: done.length })}</h2>
          {done.map((item) => (
            <ItemCard key={item.id} item={item} {...cardProps} />
          ))}
        </section>
      )}
    </div>
  )
}
