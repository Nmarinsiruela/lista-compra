import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ListTabs } from './ListTabs'

const LISTS = [
  { id: 'default', title: 'Compra' },
  { id: 'party', title: 'Fiesta' },
]

function setup(props = {}) {
  const handlers = {
    onSelect: vi.fn(),
    onCreate: vi.fn(() => true),
    onRename: vi.fn(() => true),
    onDelete: vi.fn(),
  }
  render(<ListTabs lists={LISTS} activeId="default" counts={{ party: { pending: 3, total: 4 } }} {...handlers} {...props} />)
  return handlers
}

describe('ListTabs', () => {
  it('shows a tab per list with its pending count, marking the active one', () => {
    setup()

    expect(screen.getByRole('button', { name: 'Compra' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Fiesta3' }).getAttribute('aria-pressed')).toBe('false')
  })

  it('switches to another list when its tab is tapped', () => {
    const { onSelect } = setup()

    fireEvent.click(screen.getByRole('button', { name: /^Fiesta/ }))

    expect(onSelect).toHaveBeenCalledWith('party')
  })

  it('creates a list from the + button on Enter', () => {
    const { onCreate } = setup()

    fireEvent.click(screen.getByRole('button', { name: 'Nueva lista' }))
    const input = screen.getByRole('textbox', { name: 'Nueva lista' })
    fireEvent.change(input, { target: { value: 'Oficina' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onCreate).toHaveBeenCalledWith('Oficina')
    expect(screen.queryByRole('textbox')).toBeNull()
  })

  it('keeps the input open when the title is rejected', () => {
    setup({ onCreate: vi.fn(() => false) })

    fireEvent.click(screen.getByRole('button', { name: 'Nueva lista' }))
    const input = screen.getByRole('textbox', { name: 'Nueva lista' })
    fireEvent.change(input, { target: { value: 'compra' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(screen.getByRole('textbox', { name: 'Nueva lista' }).value).toBe('compra')
  })

  it('renames the active list when its tab is tapped', () => {
    const { onRename } = setup()

    fireEvent.click(screen.getByRole('button', { name: 'Compra' }))
    const input = screen.getByRole('textbox', { name: 'Renombrar lista' })
    expect(input.value).toBe('Compra')

    fireEvent.change(input, { target: { value: 'Súper' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onRename).toHaveBeenCalledWith('default', 'Súper')
  })

  it('offers delete while renaming, except for the only list', () => {
    const { onDelete } = setup()
    fireEvent.click(screen.getByRole('button', { name: 'Compra' }))
    fireEvent.click(screen.getByRole('button', { name: 'Borrar lista' }))
    expect(onDelete).toHaveBeenCalledWith('default')
  })

  it('hides delete when there is a single list', () => {
    setup({ lists: [LISTS[0]] })
    fireEvent.click(screen.getByRole('button', { name: 'Compra' }))

    expect(screen.queryByRole('button', { name: 'Borrar lista' })).toBeNull()
  })
})
