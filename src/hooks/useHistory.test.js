import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useHistory } from './useHistory'

describe('useHistory', () => {
  it('records a name and counts repeats', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.addToHistory('Leche')
    })
    act(() => {
      result.current.addToHistory('leche')
    })

    const suggestions = result.current.getSuggestions('le', [])
    expect(suggestions).toHaveLength(1)
    expect(suggestions[0]).toMatchObject({ name: 'Leche', count: 2 })
  })

  it('returns no suggestions for an empty query', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.addToHistory('Leche')
    })

    expect(result.current.getSuggestions('', [])).toEqual([])
  })

  it('removes an entry from the history (accent/case insensitive)', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.addToHistory('Plátano')
    })
    act(() => {
      result.current.removeFromHistory('platano')
    })

    expect(result.current.getSuggestions('pla', [])).toEqual([])
    expect(localStorage.getItem('compra_historial')).toBe('{}')
  })

  it('excludes names already pending', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.addToHistory('Leche')
    })

    expect(result.current.getSuggestions('le', ['Leche'])).toEqual([])
  })

  it('ranks prefix matches above substring matches', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.addToHistory('Batido') // contains "ati"? no — contains "ti"
    })
    act(() => {
      result.current.addToHistory('Tinta') // starts with "ti"
    })

    const suggestions = result.current.getSuggestions('ti', [])
    expect(suggestions[0].name).toBe('Tinta')
  })

  it('orders equal-prefix matches by frequency', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.addToHistory('Cacao')
    })
    act(() => {
      result.current.addToHistory('Café')
    })
    act(() => {
      result.current.addToHistory('Café')
    })

    const suggestions = result.current.getSuggestions('ca', [])
    expect(suggestions[0].name).toBe('Café')
  })
})
