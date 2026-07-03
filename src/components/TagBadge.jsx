import styles from './TagBadge.module.css'

export function TagBadge({ tag }) {
  if (!tag) return null
  return (
    <span className={styles.badge} style={{ '--tag-color': tag.color }}>
      {tag.name}
    </span>
  )
}
