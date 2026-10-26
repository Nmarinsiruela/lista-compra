import { describe, it, expect, afterEach } from 'vitest'
import { buildShareUrl, consumeSharedList } from './share'

afterEach(() => {
  window.history.replaceState({}, '', '/')
})

describe('share links', () => {
  it('round-trips names and list title through the URL and removes the params once read', () => {
    window.history.replaceState({}, '', buildShareUrl(['Leche', 'Pan'], 'Fiesta de Ana'))

    expect(consumeSharedList()).toEqual({ names: ['Leche', 'Pan'], title: 'Fiesta de Ana' })
    expect(window.location.search).toBe('')
    expect(consumeSharedList()).toEqual({ names: [], title: null })
  })

  it('reads links made before lists existed (no title)', () => {
    window.history.replaceState({}, '', `/?share=${encodeURIComponent(JSON.stringify(['Leche']))}`)

    expect(consumeSharedList()).toEqual({ names: ['Leche'], title: null })
  })

  it('ignores malformed or non-string payloads', () => {
    window.history.replaceState({}, '', '/?share=not-json')
    expect(consumeSharedList().names).toEqual([])

    window.history.replaceState({}, '', `/?share=${encodeURIComponent(JSON.stringify(['Leche', 3, null]))}`)
    expect(consumeSharedList().names).toEqual(['Leche'])
  })
})
