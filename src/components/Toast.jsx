import { useState, useEffect, useCallback, useRef } from 'react'
import styles from './Toast.module.css'

export function useToast() {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const timerRef = useRef(null)

  const showToast = useCallback((msg) => {
    setMessage(msg)
    setVisible(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setVisible(false), 2000)
  }, [])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return { message, visible, showToast }
}

export function Toast({ message, visible }) {
  return (
    <div className={`${styles.toast} ${visible ? styles.show : ''}`} aria-live="polite">
      {message}
    </div>
  )
}
