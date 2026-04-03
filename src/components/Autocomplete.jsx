import styles from './Autocomplete.module.css'

export function Autocomplete({ suggestions, onSelect }) {
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
        </li>
      ))}
    </ul>
  )
}
