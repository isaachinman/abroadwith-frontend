import UILanguages from 'data/constants/UILanguages'

const mcache = require('memory-cache')


// This is a very simple html cacher -------------------------------------------
// Basically, we cache all public (static) pages, eg all requests without
// an access_token cookie. This prevents the server having to redo
// expensive renderToString computations over and over for no reason.
// More info: goenning.net/2016/02/10/simple-server-side-cache-for-expressjs
// -----------------------------------------------------------------------------

/* eslint-disable */
const cache = () => {
  return (req, res, next) => {

    // Only perform any caching/hydration if it's a logged-out page
    if (!req.cookies.access_token) {

      // Define keyname
      const key = '__express__' + req.originalUrl || req.url
      const cachedBody = mcache.get(key)

      // If the key already exists, send it down
      if (cachedBody) {
        res.send(cachedBody)
        return
      }

      res.sendResponse = res.send

      // If it doesn't, cache the body for future use and send it down
      res.send = (body) => {
        mcache.put(key, body)
        res.sendResponse(body)
      }

    }

    next()

  }
}
/* eslint-enable */

export default (app) => {

  const routesToCache = []

  // List of routes to be cached
  ;[
    '',
    'about',
    'abroadwith-for-students',
    'faq',
    'homestay/:homeID',
    'host-international-students',
    'privacy',
    'signup',
    'terms',
    'testimonials',
    'user/:userID',
  ].map(route => {

    // Loop through non-English locales
    Object.values(UILanguages).map(lang => routesToCache.push(`${lang.basepath}${route}`))

  })

  routesToCache.map(route => app.get(route, cache(), (req, res, next) => next()))

}
