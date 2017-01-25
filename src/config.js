require('babel-polyfill')

const img = {
  S3: {
    isProduction: true,
    img: 'http://img.test-abroadwith.com',
  },
  IMGIX: {
    isProduction: false,
    img: 'https://abroadwith.imgix.net',
  },
}[process.env.IMG || 'S3']

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.OVERRIDE_PORT || process.env.PORT,
  apiHost: process.env.APIHOST || 'https://api.test-abroadwith.com',
  apiPort: process.env.APIPORT,
  app: {
    title: 'Abroadwith',
    head: {
      titleTemplate: '%s',
      meta: [
        { charset: 'utf-8' },
        { property: 'og:site_name', content: 'Abroadwith' },
        { property: 'og:image', content: 'https://abroadwith.imgix.net/app/favicon/favicon.png' },
        { property: 'og:creator', content: 'Isaac Hinman' },
        { property: 'og:image:width', content: '200' },
        { property: 'og:image:height', content: '200' },
      ],
    },
  },

}, img)
