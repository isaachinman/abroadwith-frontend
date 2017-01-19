require('babel-polyfill')

module.exports = {
  host: process.env.HOST || 'localhost',
  port: process.env.OVERRIDE_PORT || process.env.PORT,
  img: process.env.IMG,
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

}
