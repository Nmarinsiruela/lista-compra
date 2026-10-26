const SHARE_PARAM = 'share'
const LIST_PARAM = 'list'

export function buildShareUrl(names, listTitle) {
  const url = new URL(window.location.href)
  url.searchParams.set(SHARE_PARAM, JSON.stringify(names))
  if (listTitle) url.searchParams.set(LIST_PARAM, listTitle)
  return url.toString()
}

// Reads the shared names and list title from the URL (if any) and removes the params so a
// reload doesn't re-import. Links made before lists existed have no title.
export function consumeSharedList() {
  const url = new URL(window.location.href)
  const raw = url.searchParams.get(SHARE_PARAM)
  if (!raw) return { names: [], title: null }

  const title = url.searchParams.get(LIST_PARAM)?.trim() || null
  url.searchParams.delete(SHARE_PARAM)
  url.searchParams.delete(LIST_PARAM)
  window.history.replaceState({}, '', url)

  try {
    const names = JSON.parse(raw)
    return { names: Array.isArray(names) ? names.filter((n) => typeof n === 'string') : [], title }
  } catch {
    return { names: [], title }
  }
}
