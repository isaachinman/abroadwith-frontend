import i18n from 'i18next'
import Backend from 'i18next-node-fs-backend'
import { LanguageDetector } from 'i18next-express-middleware'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .init({
    whitelist: ['en', 'es', 'de'],
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // Not needed for React
    },
    backend: {
      loadPath: 'build/locales/{{lng}}.json',
      jsonIndent: 2,
    },
  })

export default i18n
