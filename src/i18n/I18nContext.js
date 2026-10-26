import { createContext, useContext } from 'react'
import { createTranslator } from './translate'
import { DEFAULT_LANGUAGE } from './translations'

// The default value lets components render (e.g. in isolated tests) without an <I18nProvider>.
export const I18nContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: createTranslator(DEFAULT_LANGUAGE),
})

export function useI18n() {
  return useContext(I18nContext)
}
