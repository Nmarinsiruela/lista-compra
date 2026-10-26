import { useState, useEffect, useCallback } from 'react'
import { STORAGE_KEYS, loadJSON, saveJSON } from '../utils/storage'

const THEMES = ['dark', 'light']
const DEFAULT_THEME = 'dark'

function loadTheme() {
  const saved = loadJSON(STORAGE_KEYS.theme, null)
  return THEMES.includes(saved) ? saved : DEFAULT_THEME
}

export function useTheme() {
  const [theme, setTheme] = useState(loadTheme)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    // Keep the mobile browser chrome in step with the header colour.
    const barColor = getComputedStyle(root).getPropertyValue('--bar').trim()
    if (barColor) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', barColor)
    saveJSON(STORAGE_KEYS.theme, theme)
  }, [theme])

  const toggleTheme = useCallback(() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')), [])

  return { theme, toggleTheme }
}
