import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nProvider } from '../i18n/I18nProvider'
import { LanguageSwitch } from './LanguageSwitch'

describe('LanguageSwitch', () => {
  it('switches language, persists it and updates the document', () => {
    localStorage.setItem('compra_idioma', JSON.stringify('es'))
    render(
      <I18nProvider>
        <LanguageSwitch />
      </I18nProvider>,
    )

    expect(screen.getByRole('button', { name: 'Español' }).getAttribute('aria-pressed')).toBe('true')

    fireEvent.click(screen.getByRole('button', { name: 'Inglés' }))

    expect(screen.getByRole('button', { name: 'English' }).getAttribute('aria-pressed')).toBe('true')
    expect(JSON.parse(localStorage.getItem('compra_idioma'))).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe('Shopping List')
  })
})
