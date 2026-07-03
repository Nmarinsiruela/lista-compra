import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Reset the DOM and persisted state between tests so localStorage-backed
// hooks start from a clean slate every time.
afterEach(() => {
  cleanup()
  localStorage.clear()
})
