import { translations, DEFAULT_LANGUAGE } from './translations'

function interpolate(str, params) {
  return str.replace(/\{(\w+)\}/g, (match, key) => (key in params ? params[key] : match))
}

// Builds t(key, params) for a language. Missing keys fall back to the default language, then to the key itself.
export function createTranslator(language) {
  const dict = translations[language] ?? translations[DEFAULT_LANGUAGE]
  const fallback = translations[DEFAULT_LANGUAGE]
  const plurals = new Intl.PluralRules(language)

  return (key, params = {}) => {
    let entry = dict[key] ?? fallback[key] ?? key
    if (typeof entry === 'object') entry = entry[plurals.select(params.count ?? 0)] ?? entry.other
    return interpolate(entry, params)
  }
}
