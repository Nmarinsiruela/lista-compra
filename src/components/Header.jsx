import { useI18n } from '../i18n/I18nContext'
import { LanguageSwitch } from './LanguageSwitch'
import { ThemeToggle } from './ThemeToggle'
import styles from './Header.module.css'

function ShareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

export function Header({ pending, done, onClearAll, onEmptyCart, onShare }) {
  const { t } = useI18n()
  const total = pending.length + done.length
  const statsText = total === 0
    ? t('header.statsEmpty')
    : t('header.stats', { done: done.length, count: total })

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <h1 className={styles.title}>{t('header.title')}</h1>
        <div className={styles.headerActions}>
          <button className={styles.clearAllBtn} onClick={onEmptyCart}>
            {t('header.emptyCart')}
          </button>
          <button className={styles.clearAllBtn} onClick={onClearAll}>
            {t('header.clearAll')}
          </button>
          <button className={styles.shareBtn} onClick={onShare} aria-label={t('header.share')}>
            <ShareIcon />
          </button>
        </div>
        <p className={styles.stats}>{statsText}</p>
        <div className={styles.settings}>
          <ThemeToggle />
          <LanguageSwitch />
        </div>
      </div>
    </header>
  )
}
