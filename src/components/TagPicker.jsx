import { SystemTagIcon } from './TagBadge'
import styles from './TagPicker.module.css'

// Multi-select over a fixed list of tags: each chip toggles on and off.
export function TagPicker({ allTags, selected, onToggle }) {
  const selectedSet = new Set(selected)

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
            {tag.system && <SystemTagIcon />}
            {tag.name}
          </button>
        )
      })}
    </div>
  )
}
