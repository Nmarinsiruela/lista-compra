import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Autocomplete } from './Autocomplete'

const SUGGESTIONS = [
  { name: 'Leche', count: 3 },
  { name: 'Lechuga', count: 1 },
]

describe('Autocomplete', () => {
  it('renders nothing when there are no suggestions', () => {
    const { container } = render(
      <Autocomplete suggestions={[]} onSelect={() => {}} onDelete={() => {}} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('calls onSelect when a suggestion is chosen', () => {
    const onSelect = vi.fn()
    render(<Autocomplete suggestions={SUGGESTIONS} onSelect={onSelect} onDelete={() => {}} />)

    fireEvent.pointerDown(screen.getAllByRole('option')[0])

    expect(onSelect).toHaveBeenCalledWith('Leche')
  })

  it('calls onDelete without selecting when the trash button is pressed', () => {
    const onSelect = vi.fn()
    const onDelete = vi.fn()
    render(<Autocomplete suggestions={SUGGESTIONS} onSelect={onSelect} onDelete={onDelete} />)

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Eliminar "Lechuga" del historial' }))

    expect(onDelete).toHaveBeenCalledWith('Lechuga')
    expect(onSelect).not.toHaveBeenCalled()
  })
})
