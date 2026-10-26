import { describe, it, expect, afterEach } from 'vitest'
import { buildShareUrl, consumeSharedNames } from './share'

afterEach(() => {
  window.history.replaceState({}, '', '/')
})

describe('share links', () => {
  it('round-trips names through the URL and removes the param once read', () => {
    window.history.replaceState({}, '', buildShareUrl(['Leche', 'Pan']))

    expect(consumeSharedNames()).toEqual(['Leche', 'Pan'])
    expect(window.location.search).toBe('')
    expect(consumeSharedNames()).toEqual([])
  })

  it('ignores malformed or non-string payloads', () => {
    window.history.replaceState({}, '', '/?share=not-json')
    expect(consumeSharedNames()).toEqual([])

    window.history.replaceState({}, '', `/?share=${encodeURIComponent(JSON.stringify(['Leche', 3, null]))}`)
    expect(consumeSharedNames()).toEqual(['Leche'])
  })
})
