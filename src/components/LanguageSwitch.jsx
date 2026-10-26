import { useI18n } from '../i18n/I18nContext'
import { LANGUAGES } from '../i18n/translations'
import styles from './LanguageSwitch.module.css'

export function LanguageSwitch() {
  const { language, setLanguage, t } = useI18n()

  return (
    <div className={styles.switch} role="group" aria-label={t('language.label')}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          lang={lang}
          className={`${styles.option} ${lang === language ? styles.active : ''}`}
          onClick={() => setLanguage(lang)}
          aria-pressed={lang === language}
          aria-label={t(`language.${lang}`)}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
