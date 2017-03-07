require('babel-polyfill')

if (typeof window === 'undefined') {

  const img = {
    S3: {
      img: 'https://s3.eu-central-1.amazonaws.com/img.test-abroadwith.com',
      s3: 'img.test-abroadwith.com',
    },
    IMGIX: {
      img: 'https://abroadwith.imgix.net',
      s3: 'img.abroadwith.com',
    },
  }[process.env.IMG || 'IMGIX']

  const solr = {
    PROD: {
      solr: {
        host: '35.157.185.49',
        port: 8983,
      },
    },
    DEV: {
      solr: {
        host: '35.157.15.140',
        port: 8983,
      },
    },
  }[process.env.SOLR || 'PROD']

  module.exports = Object.assign({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
    apiHost: process.env.APIHOST || 'https://api.test-abroadwith.com',
    apiPort: process.env.APIPORT || 443,
    cookieDomain: process.env.NODE_ENV === 'production' ? '.abroadwith.com' : '.test-abroadwith.com',
    facebookAppID: process.env.NODE_ENV === 'production' ? '144948059203060' : '144997212531478',
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

  }, img, solr)
} else if (typeof window === 'object' && typeof window.__config === 'object') {
  module.exports = Object.assign({}, window.__config)
} else {
  module.exports = {}
}
