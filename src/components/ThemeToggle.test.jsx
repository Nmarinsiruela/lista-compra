import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'

afterEach(() => {
  delete document.documentElement.dataset.theme
})

describe('ThemeToggle', () => {
  it('starts in dark mode by default', () => {
    render(<ThemeToggle />)

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(screen.getByRole('button', { name: 'Cambiar a modo claro' })).toBeDefined()
  })

  it('switches theme and remembers the choice', () => {
    render(<ThemeToggle />)

    fireEvent.click(screen.getByRole('button', { name: 'Cambiar a modo claro' }))

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(JSON.parse(localStorage.getItem('compra_tema'))).toBe('light')
    expect(screen.getByRole('button', { name: 'Cambiar a modo oscuro' })).toBeDefined()
  })

  it('restores a saved light theme', () => {
    localStorage.setItem('compra_tema', JSON.stringify('light'))
    render(<ThemeToggle />)

    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
