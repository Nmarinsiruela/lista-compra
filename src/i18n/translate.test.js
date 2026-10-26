import { describe, it, expect } from 'vitest'
import { createTranslator } from './translate'
import { translations } from './translations'

describe('createTranslator', () => {
  it('translates a plain key per language', () => {
    expect(createTranslator('es')('header.clearAll')).toBe('Limpiar todo')
    expect(createTranslator('en')('header.clearAll')).toBe('Clear all')
  })

  it('fills placeholders', () => {
    expect(createTranslator('en')('toast.added', { name: 'Milk' })).toBe('"Milk" added')
  })

  it('picks the plural form from the count', () => {
    const t = createTranslator('es')
    expect(t('toast.imported', { count: 1 })).toBe('1 producto importado')
    expect(t('toast.imported', { count: 3 })).toBe('3 productos importados')
  })

  it('falls back to the key when it is missing everywhere', () => {
    expect(createTranslator('en')('nope.missing')).toBe('nope.missing')
  })

  it('defines the same keys in every language', () => {
    const [base, ...rest] = Object.values(translations).map((dict) => Object.keys(dict).sort())
    for (const keys of rest) expect(keys).toEqual(base)
  })
})
