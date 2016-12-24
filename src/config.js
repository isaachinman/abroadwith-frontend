require('babel-polyfill')

const environment = {
  development: {
    isProduction: false,
    img: 'http://img.test-abroadwith.com',
  },
  production: {
    isProduction: true,
    img: 'https://abroadwith.imgix.net',
  },
}[process.env.NODE_ENV || 'development']

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.OVERRIDE_PORT || process.env.PORT,
  apiHost: process.env.APIHOST || 'https://api.test-abroadwith.com',
  apiPort: process.env.APIPORT,
  app: {
    title: 'Abroadwith',
    description: 'Immerse in a new language and culture',
    head: {
      titleTemplate: '%s',
      meta: [
        { name: 'description', content: 'All the modern best practices in one example.' },
        { charset: 'utf-8' },
        { property: 'og:site_name', content: 'Abroadwith' },
        { property: 'og:image', content: 'https://abroadwith.imgix.net/app/favicon/favicon.png' },
        { property: 'og:locale', content: 'en' },
        { property: 'og:title', content: 'This is the meta title' },
        { property: 'og:description', content: 'This is the meta description' },
        { property: 'og:card', content: 'summary' },
        { property: 'og:creator', content: 'Isaac Hinman' },
        { property: 'og:image:width', content: '200' },
        { property: 'og:image:height', content: '200' },
      ],
    },
  },

}, environment)
