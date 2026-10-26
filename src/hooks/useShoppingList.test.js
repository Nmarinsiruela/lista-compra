import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useShoppingList } from './useShoppingList'

describe('useShoppingList', () => {
  it('adds an item to the pending list', () => {
    const { result } = renderHook(() => useShoppingList())

    act(() => {
      result.current.addItem('Leche')
    })

    expect(result.current.pending).toHaveLength(1)
    expect(result.current.pending[0].name).toBe('Leche')
    expect(result.current.pending[0].tags).toEqual([])
  })

  it('capitalizes the item name', () => {
    const { result } = renderHook(() => useShoppingList())

    act(() => {
      result.current.addItem('  pan INTEGRAL ')
    })

    expect(result.current.pending[0].name).toBe('Pan integral')
  })

  it('rejects a duplicate pending item (accent/case insensitive)', () => {
    const { result } = renderHook(() => useShoppingList())

    act(() => {
      result.current.addItem('Plátano')
    })

    let res
    act(() => {
      res = result.current.addItem('platano')
    })

    expect(res).toMatchObject({ ok: false, status: 'duplicate', name: 'Plátano' })
    expect(result.current.pending).toHaveLength(1)
  })

  it('adds an item with tags, de-duplicating tag keys', () => {
    const { result } = renderHook(() => useShoppingList())

    act(() => {
      result.current.addItem('Pañales', ['family', 'family', 'me'])
    })

    expect(result.current.pending[0].tags).toEqual(['family', 'me'])
  })

  it('toggles an item between pending and done', () => {
    const { result } = renderHook(() => useShoppingList())

    act(() => {
      result.current.addItem('Leche')
    })
    const id = result.current.pending[0].id

    act(() => {
      result.current.toggleItem(id)
    })
    expect(result.current.pending).toHaveLength(0)
    expect(result.current.done).toHaveLength(1)

    act(() => {
      result.current.toggleItem(id)
    })
    expect(result.current.pending).toHaveLength(1)
    expect(result.current.done).toHaveLength(0)
  })

  it('toggles a tag on and off an item', () => {
    const { result } = renderHook(() => useShoppingList())

    act(() => {
      result.current.addItem('Leche')
    })
    const id = result.current.pending[0].id

    act(() => {
      result.current.toggleItemTag(id, 'family')
    })
    expect(result.current.pending[0].tags).toEqual(['family'])

    act(() => {
      result.current.toggleItemTag(id, 'family')
    })
    expect(result.current.pending[0].tags).toEqual([])
  })

  it('lets an item carry several tags at once', () => {
    const { result } = renderHook(() => useShoppingList())

    act(() => {
      result.current.addItem('Café')
    })
    const id = result.current.pending[0].id

    act(() => {
      result.current.toggleItemTag(id, 'me')
    })
    act(() => {
      result.current.toggleItemTag(id, 'friends')
    })

    expect(result.current.pending[0].tags).toEqual(['me', 'friends'])
  })

  it('empties the cart by returning done items to pending', () => {
    const { result } = renderHook(() => useShoppingList())

    act(() => {
      result.current.addItem('Leche')
    })
    const id = result.current.pending[0].id
    act(() => {
      result.current.toggleItem(id)
    })

    let res
    act(() => {
      res = result.current.emptyCart()
    })

    expect(res.count).toBe(1)
    expect(result.current.done).toHaveLength(0)
    expect(result.current.pending).toHaveLength(1)
  })

  it('clears the whole list', () => {
    const { result } = renderHook(() => useShoppingList())

    act(() => {
      result.current.addItem('Leche')
    })
    act(() => {
      result.current.addItem('Pan')
    })

    let res
    act(() => {
      res = result.current.clearAll()
    })

    expect(res.count).toBe(2)
    expect(result.current.list).toHaveLength(0)
  })

  it('imports new names while skipping ones already present', () => {
    const { result } = renderHook(() => useShoppingList())

    act(() => {
      result.current.addItem('Leche')
    })

    let res
    act(() => {
      res = result.current.importItems(['Leche', 'Huevos', 'Pan'])
    })

    expect(res.added).toBe(2)
    expect(result.current.pending.map((i) => i.name).sort()).toEqual(['Huevos', 'Leche', 'Pan'])
  })

  it('attaches the given tags to imported items only', () => {
    const { result } = renderHook(() => useShoppingList())

    act(() => {
      result.current.addItem('Leche')
    })
    act(() => {
      result.current.importItems(['Leche', 'Huevos'], ['external'])
    })

    const byName = Object.fromEntries(result.current.pending.map((i) => [i.name, i.tags]))
    expect(byName).toEqual({ Leche: [], Huevos: ['external'] })
  })

  it('records a check-off in the history exactly once', () => {
    const { result } = renderHook(() => useShoppingList())

    act(() => {
      result.current.addItem('Leche')
    })
    act(() => {
      result.current.toggleItem(result.current.pending[0].id)
    })

    expect(result.current.getSuggestions('le', [])[0].count).toBe(2)
  })

  it('migrates legacy items stored without a tags field', () => {
    localStorage.setItem(
      'compra_lista',
      JSON.stringify([{ id: 'x1', name: 'Leche', done: false, addedAt: 1 }]),
    )

    const { result } = renderHook(() => useShoppingList())

    expect(result.current.pending[0].tags).toEqual([])
  })

  it('migrates free-text tags from earlier versions onto the fixed set', () => {
    localStorage.setItem(
      'compra_lista',
      JSON.stringify([{ id: 'x1', name: 'Pañales', done: false, addedAt: 1, tags: ['familia', 'trabajo'] }]),
    )

    const { result } = renderHook(() => useShoppingList())

    expect(result.current.pending[0].tags).toEqual(['family', 'other'])
  })

  it('persists the list to localStorage', () => {
    const { result } = renderHook(() => useShoppingList())

    act(() => {
      result.current.addItem('Leche', ['family'])
    })

    const stored = JSON.parse(localStorage.getItem('compra_lista'))
    expect(stored).toHaveLength(1)
    expect(stored[0]).toMatchObject({ name: 'Leche', tags: ['family'] })
  })
})
