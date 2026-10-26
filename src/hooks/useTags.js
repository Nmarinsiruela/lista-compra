import { useCallback, useMemo } from 'react'
import { TAGS } from '../utils/tags'
import { useI18n } from '../i18n/I18nContext'

// The fixed tag list with names in the active language.
export function useTags() {
  const { t } = useI18n()

  const allTags = useMemo(() => TAGS.map((tag) => ({ ...tag, name: t(`tags.${tag.key}`) })), [t])

  const getTag = useCallback((key) => allTags.find((tag) => tag.key === key) ?? null, [allTags])

  return { allTags, getTag }
}
