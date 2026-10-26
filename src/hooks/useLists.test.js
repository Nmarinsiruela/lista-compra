import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useLists, DEFAULT_LIST_ID } from './useLists'

describe('useLists', () => {
  it('starts with a single default list that is active', () => {
    const { result } = renderHook(() => useLists())

    expect(result.current.lists).toEqual([expect.objectContaining({ id: DEFAULT_LIST_ID, title: 'Compra' })])
    expect(result.current.activeList.id).toBe(DEFAULT_LIST_ID)
  })

  it('creates a list, tidies its title and makes it active', () => {
    const { result } = renderHook(() => useLists())

    let res
    act(() => {
      res = result.current.createList('  Material   de oficina ')
    })

    expect(res.status).toBe('created')
    expect(result.current.lists.map((l) => l.title)).toEqual(['Compra', 'Material de oficina'])
    expect(result.current.activeList.title).toBe('Material de oficina')
  })

  it('rejects a title already in use, ignoring case and accents', () => {
    const { result } = renderHook(() => useLists())

    act(() => {
      result.current.createList('Fiesta')
    })
    let res
    act(() => {
      res = result.current.createList('FIÉSTA')
    })

    expect(res).toEqual({ status: 'duplicate', title: 'Fiesta' })
    expect(result.current.lists).toHaveLength(2)
  })

  it('rejects an empty title', () => {
    const { result } = renderHook(() => useLists())

    let res
    act(() => {
      res = result.current.createList('   ')
    })

    expect(res.status).toBe('empty')
    expect(result.current.lists).toHaveLength(1)
  })

  it('renames a list, allowing a case change of its own title but not another list\'s title', () => {
    const { result } = renderHook(() => useLists())
    act(() => {
      result.current.createList('Fiesta')
    })
    const fiestaId = result.current.activeList.id

    let res
    act(() => {
      res = result.current.renameList(fiestaId, 'compra')
    })
    expect(res).toEqual({ status: 'duplicate', title: 'Compra' })

    act(() => {
      res = result.current.renameList(fiestaId, 'FIESTA')
    })
    expect(res.status).toBe('renamed')
    expect(result.current.activeList.title).toBe('FIESTA')
  })

  it('deletes a list and moves to another one, but never deletes the last list', () => {
    const { result } = renderHook(() => useLists())
    act(() => {
      result.current.createList('Fiesta')
    })

    let res
    act(() => {
      res = result.current.deleteList(result.current.activeList.id)
    })
    expect(res.status).toBe('deleted')
    expect(result.current.activeList.id).toBe(DEFAULT_LIST_ID)

    act(() => {
      res = result.current.deleteList(DEFAULT_LIST_ID)
    })
    expect(res.status).toBe('last')
    expect(result.current.lists).toHaveLength(1)
  })

  it('remembers lists and the active one across reloads', () => {
    const first = renderHook(() => useLists())
    act(() => {
      first.result.current.createList('Fiesta')
    })
    first.unmount()

    const { result } = renderHook(() => useLists())

    expect(result.current.lists.map((l) => l.title)).toEqual(['Compra', 'Fiesta'])
    expect(result.current.activeList.title).toBe('Fiesta')
  })
})
