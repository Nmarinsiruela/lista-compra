import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTags } from './useTags'
import { I18nContext } from '../i18n/I18nContext'
import { createTranslator } from '../i18n/translate'
import { migrateTags } from '../utils/tags'

describe('useTags', () => {
  it('exposes the fixed tag list in order, named in Spanish by default', () => {
    const { result } = renderHook(() => useTags())

    expect(result.current.allTags.map((t) => [t.key, t.name])).toEqual([
      ['me', 'Yo'],
      ['family', 'Familia'],
      ['friends', 'Amigos'],
      ['other', 'Otros'],
      ['external', 'Externo'],
    ])
  })

  it('flags only External as a system tag', () => {
    const { result } = renderHook(() => useTags())

    expect(result.current.allTags.filter((t) => t.system).map((t) => t.key)).toEqual(['external'])
  })

  it('names tags in the active language', () => {
    const wrapper = ({ children }) => (
      <I18nContext.Provider value={{ language: 'en', setLanguage: () => {}, t: createTranslator('en') }}>
        {children}
      </I18nContext.Provider>
    )
    const { result } = renderHook(() => useTags(), { wrapper })

    expect(result.current.getTag('friends').name).toBe('Friends')
    expect(result.current.getTag('external').name).toBe('External')
  })

  it('returns null for an unknown key', () => {
    const { result } = renderHook(() => useTags())

    expect(result.current.getTag('nope')).toBeNull()
  })
})

describe('migrateTags', () => {
  it('maps legacy free-text tags onto the fixed set and de-duplicates', () => {
    expect(migrateTags(['familia', 'yo', 'amigos', 'family'])).toEqual(['family', 'me', 'friends'])
  })

  it('files unknown legacy tags under "other"', () => {
    expect(migrateTags(['trabajo', 'urgente', 'external'])).toEqual(['other', 'external'])
  })
})
