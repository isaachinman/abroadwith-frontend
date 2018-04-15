import i18n from 'i18next'

i18n
  .init({
    whitelist: ['en', 'es', 'de'],
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // Not needed for React
    },
  })

export default i18n
