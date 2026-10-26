// The fixed set of tags an item can carry, in display order. Labels live in the
// translations under `tags.<key>`. `external` is applied automatically to
// products imported from a shared link.
export const TAGS = [
  { key: 'me', color: '#2563eb' },
  { key: 'family', color: '#db2777' },
  { key: 'friends', color: '#d97706' },
  { key: 'other', color: '#7c3aed' },
  { key: 'external', color: '#64748b', system: true },
]

export const EXTERNAL_TAG = 'external'

const TAG_KEYS = new Set(TAGS.map((tag) => tag.key))

// Earlier versions let users type their own tags (stored as normalized keys).
// Map the common ones onto the fixed set and file anything else under "other".
const LEGACY_TAGS = {
  yo: 'me',
  mio: 'me',
  mia: 'me',
  propio: 'me',
  propia: 'me',
  familia: 'family',
  amigos: 'friends',
  amigas: 'friends',
  otro: 'other',
  otros: 'other',
}

export function migrateTags(keys) {
  return [...new Set(keys.map((key) => (TAG_KEYS.has(key) ? key : LEGACY_TAGS[key] ?? 'other')))]
}
