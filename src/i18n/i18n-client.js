import i18n from 'i18next'

i18n
  .init({
    whitelist: ['en', 'es', 'de'],
    fallbackLng: 'en',

    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react!!
    },
  })

export default i18n
