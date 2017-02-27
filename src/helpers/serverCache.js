const mcache = require('memory-cache')

// This is a very simple html cacher -------------------------------------------
// Basically, we cache all public pages, eg all requests without
// an access_token cookie. This prevents the server having to redo
// expensive renderToString computations over and over for no reason.
// -----------------------------------------------------------------------------

/* eslint-disable */
const cache = (duration) => {
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
        mcache.put(key, body, duration * 1000)
        res.sendResponse(body)
      }

    }

    next()

  }
}
/* eslint-enable */

export default (app) => {

  // List of routes to be cached (argument for cache function is lifetime in seconds)
  const routesToCache = [
    '/',
    '/es/',
    '/de/',
  ]

  routesToCache.map(route => app.get(route, cache(3600), (req, res, next) => next()))

}
