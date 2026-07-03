import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TagPicker } from './TagPicker'

const TAGS = [
  { key: 'familia', name: 'Familia', color: '#2563eb' },
  { key: 'yo', name: 'Yo', color: '#db2777' },
]

describe('TagPicker', () => {
  it('renders a chip for every tag', () => {
    render(<TagPicker allTags={TAGS} selected={[]} onToggle={() => {}} onCreate={() => {}} />)

    expect(screen.getByRole('button', { name: 'Familia' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Yo' })).toBeDefined()
  })

  it('marks selected tags as pressed', () => {
    render(<TagPicker allTags={TAGS} selected={['familia']} onToggle={() => {}} onCreate={() => {}} />)

    expect(screen.getByRole('button', { name: 'Familia' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Yo' }).getAttribute('aria-pressed')).toBe('false')
  })

  it('calls onToggle with the tag key when a chip is clicked', () => {
    const onToggle = vi.fn()
    render(<TagPicker allTags={TAGS} selected={[]} onToggle={onToggle} onCreate={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: 'Familia' }))

    expect(onToggle).toHaveBeenCalledWith('familia')
  })

  it('creates a new tag from the inline input on Enter', () => {
    const onCreate = vi.fn()
    render(<TagPicker allTags={TAGS} selected={[]} onToggle={() => {}} onCreate={onCreate} />)

    fireEvent.click(screen.getByRole('button', { name: '+ Etiqueta' }))
    const input = screen.getByPlaceholderText('Nueva etiqueta…')
    fireEvent.change(input, { target: { value: 'Trabajo' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onCreate).toHaveBeenCalledWith('Trabajo')
  })

  it('does not create a tag for a blank name', () => {
    const onCreate = vi.fn()
    render(<TagPicker allTags={TAGS} selected={[]} onToggle={() => {}} onCreate={onCreate} />)

    fireEvent.click(screen.getByRole('button', { name: '+ Etiqueta' }))
    const input = screen.getByPlaceholderText('Nueva etiqueta…')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onCreate).not.toHaveBeenCalled()
  })
})
