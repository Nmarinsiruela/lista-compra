import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TagPicker } from './TagPicker'

const TAGS = [
  { key: 'family', name: 'Familia', color: '#db2777' },
  { key: 'me', name: 'Yo', color: '#2563eb' },
  { key: 'external', name: 'Externo', color: '#64748b', system: true },
]

describe('TagPicker', () => {
  it('renders a chip for every tag and nothing to create new ones', () => {
    render(<TagPicker allTags={TAGS} selected={[]} onToggle={() => {}} />)

    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['Familia', 'Yo', 'Externo'])
    expect(screen.queryByRole('textbox')).toBeNull()
  })

  it('marks every selected tag as pressed', () => {
    render(<TagPicker allTags={TAGS} selected={['family', 'external']} onToggle={() => {}} />)

    expect(screen.getByRole('button', { name: 'Familia' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Yo' }).getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByRole('button', { name: 'Externo' }).getAttribute('aria-pressed')).toBe('true')
  })

  it('calls onToggle with the tag key when a chip is clicked', () => {
    const onToggle = vi.fn()
    render(<TagPicker allTags={TAGS} selected={[]} onToggle={onToggle} />)

    fireEvent.click(screen.getByRole('button', { name: 'Familia' }))

    expect(onToggle).toHaveBeenCalledWith('family')
  })
})
