export const STORAGE_KEYS = {
  list: 'compra_lista',
  history: 'compra_historial',
  language: 'compra_idioma',
  // Also read by the inline script in index.html.
  theme: 'compra_tema',
}

export function loadJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}
