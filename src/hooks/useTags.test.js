import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTags } from './useTags'

describe('useTags', () => {
  it('creates a tag and returns its normalized key', () => {
    const { result } = renderHook(() => useTags())

    let key
    act(() => {
      key = result.current.ensureTag('Familia')
    })

    expect(key).toBe('familia')
    expect(result.current.getTag('familia')).toEqual({
      name: 'Familia',
      color: expect.any(String),
    })
  })

  it('normalizes accents and case when creating tags', () => {
    const { result } = renderHook(() => useTags())

    let key
    act(() => {
      key = result.current.ensureTag('  MAMÁ ')
    })

    expect(key).toBe('mama')
    expect(result.current.getTag('mama').name).toBe('Mamá')
  })

  it('does not duplicate an existing tag and keeps its colour', () => {
    const { result } = renderHook(() => useTags())

    act(() => {
      result.current.ensureTag('Familia')
    })
    const firstColor = result.current.getTag('familia').color

    act(() => {
      result.current.ensureTag('familia')
    })

    expect(result.current.allTags).toHaveLength(1)
    expect(result.current.getTag('familia').color).toBe(firstColor)
  })

  it('assigns distinct colours to different tags', () => {
    const { result } = renderHook(() => useTags())

    act(() => {
      result.current.ensureTag('Familia')
    })
    act(() => {
      result.current.ensureTag('Trabajo')
    })

    const colors = result.current.allTags.map((t) => t.color)
    expect(new Set(colors).size).toBe(2)
  })

  it('ignores blank names', () => {
    const { result } = renderHook(() => useTags())

    let key
    act(() => {
      key = result.current.ensureTag('   ')
    })

    expect(key).toBeNull()
    expect(result.current.allTags).toHaveLength(0)
  })

  it('removes a tag from the registry', () => {
    const { result } = renderHook(() => useTags())

    act(() => {
      result.current.ensureTag('Familia')
    })
    act(() => {
      result.current.removeTag('familia')
    })

    expect(result.current.getTag('familia')).toBeNull()
    expect(result.current.allTags).toHaveLength(0)
  })

  it('persists tags to localStorage', () => {
    const { result } = renderHook(() => useTags())

    act(() => {
      result.current.ensureTag('Familia')
    })

    const stored = JSON.parse(localStorage.getItem('compra_tags'))
    expect(stored).toHaveProperty('familia')
    expect(stored.familia.name).toBe('Familia')
  })

  it('loads previously persisted tags on init', () => {
    localStorage.setItem(
      'compra_tags',
      JSON.stringify({ familia: { name: 'Familia', color: '#2563eb' } }),
    )

    const { result } = renderHook(() => useTags())

    expect(result.current.getTag('familia').name).toBe('Familia')
  })

  it('sorts allTags alphabetically', () => {
    const { result } = renderHook(() => useTags())

    act(() => {
      result.current.ensureTag('Zumo')
    })
    act(() => {
      result.current.ensureTag('Ajo')
    })

    expect(result.current.allTags.map((t) => t.name)).toEqual(['Ajo', 'Zumo'])
  })
})
