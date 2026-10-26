import styles from './Toast.module.css'

export function Toast({ message, visible }) {
  return (
    <div className={`${styles.toast} ${visible ? styles.show : ''}`} aria-live="polite">
      {message}
    </div>
  )
}
