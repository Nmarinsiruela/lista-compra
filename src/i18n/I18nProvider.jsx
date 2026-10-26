import { useState, useEffect, useMemo, useCallback } from 'react'
import { I18nContext } from './I18nContext'
import { createTranslator } from './translate'
import { LANGUAGES, DEFAULT_LANGUAGE } from './translations'
import { STORAGE_KEYS, loadJSON, saveJSON } from '../utils/storage'

function detectLanguage() {
  const saved = loadJSON(STORAGE_KEYS.language, null)
  if (LANGUAGES.includes(saved)) return saved

  const browser = navigator.language?.slice(0, 2).toLowerCase()
  return LANGUAGES.includes(browser) ? browser : DEFAULT_LANGUAGE
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(detectLanguage)

  const setLanguage = useCallback((lang) => {
    if (!LANGUAGES.includes(lang)) return
    setLanguageState(lang)
    saveJSON(STORAGE_KEYS.language, lang)
  }, [])

  const t = useMemo(() => createTranslator(language), [language])

  useEffect(() => {
    document.documentElement.lang = language
    document.title = t('app.title')
  }, [language, t])

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
