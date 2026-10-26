const SHARE_PARAM = 'share'

export function buildShareUrl(names) {
  const url = new URL(window.location.href)
  url.searchParams.set(SHARE_PARAM, JSON.stringify(names))
  return url.toString()
}

// Reads the shared names from the URL (if any) and removes the param so a reload doesn't re-import.
export function consumeSharedNames() {
  const url = new URL(window.location.href)
  const raw = url.searchParams.get(SHARE_PARAM)
  if (!raw) return []

  url.searchParams.delete(SHARE_PARAM)
  window.history.replaceState({}, '', url)

  try {
    const names = JSON.parse(raw)
    return Array.isArray(names) ? names.filter((n) => typeof n === 'string') : []
  } catch {
    return []
  }
}
