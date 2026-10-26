import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import App from './App'

afterEach(() => {
  window.history.replaceState({}, '', '/')
  vi.restoreAllMocks()
})

const tab = (name) => within(screen.getByRole('navigation', { name: 'Listas' })).getByRole('button', { name: new RegExp(`^${name}`) })

function createList(title) {
  fireEvent.click(screen.getByRole('button', { name: 'Nueva lista' }))
  const input = screen.getByRole('textbox', { name: 'Nueva lista' })
  fireEvent.change(input, { target: { value: title } })
  fireEvent.keyDown(input, { key: 'Enter' })
}

function addProduct(name) {
  const input = screen.getByPlaceholderText('Añadir producto...')
  fireEvent.change(input, { target: { value: name } })
  fireEvent.keyDown(input, { key: 'Enter' })
}

describe('App with several lists', () => {
  it('keeps each list\'s products separate', () => {
    render(<App />)
    addProduct('Leche')

    createList('Fiesta')
    expect(tab('Fiesta').getAttribute('aria-pressed')).toBe('true')
    expect(screen.queryByText('Leche')).toBeNull()

    addProduct('Globos')
    fireEvent.click(tab('Compra'))

    expect(screen.getByText('Leche')).toBeDefined()
    expect(screen.queryByText('Globos')).toBeNull()
  })

  it('refuses a duplicate title and says why', () => {
    render(<App />)

    createList('COMPRA')

    expect(screen.getByText('Ya existe una lista "Compra"')).toBeDefined()
    expect(screen.getByRole('textbox', { name: 'Nueva lista' })).toBeDefined()
  })

  it('imports a shared link into a list with the link\'s title, tagged External', () => {
    window.history.replaceState({}, '', `/?share=${encodeURIComponent(JSON.stringify(['globos', 'velas']))}&list=Fiesta`)

    render(<App />)

    expect(tab('Fiesta').getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByText('Globos')).toBeDefined()
    expect(screen.getAllByText('Externo')).toHaveLength(2)
    expect(screen.getByText('2 productos importados en "Fiesta"')).toBeDefined()
  })

  it('merges a shared link into an existing list with the same title', () => {
    render(<App />).unmount()
    window.history.replaceState({}, '', `/?share=${encodeURIComponent(JSON.stringify(['pan']))}&list=compra`)

    render(<App />)

    expect(screen.getAllByRole('button', { pressed: true }).map((b) => b.textContent)).toContain('Compra1')
    expect(screen.getByText('Pan')).toBeDefined()
  })

  it('deletes a list and its products after confirming', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<App />)
    createList('Fiesta')
    addProduct('Globos')

    fireEvent.click(tab('Fiesta'))
    fireEvent.click(screen.getByRole('button', { name: 'Borrar lista' }))

    expect(confirm).toHaveBeenCalledWith('¿Borrar "Fiesta" y su producto?')
    expect(screen.queryByRole('button', { name: /^Fiesta/ })).toBeNull()
    expect(JSON.parse(localStorage.getItem('compra_lista'))).toEqual([])
  })
})
