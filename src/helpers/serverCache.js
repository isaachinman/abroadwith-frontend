const mcache = require('memory-cache')

// This is a very simple html cacher -------------------------------------------
// Basically, we cache all public pages, eg all requests without
// an access_token cookie. This prevents the server having to redo
// expensive renderToString computations over and over for no reason.
// -----------------------------------------------------------------------------

/* eslint-disable */
const cache = (duration) => {
  return (req, res, next) => {
    const key = '__express__' + req.originalUrl || req.url
    const cachedBody = mcache.get(key)
    if (cachedBody && !req.cookies.access_token) {
      res.send(cachedBody)
      return
    }
    res.sendResponse = res.send
    res.send = (body) => {
      mcache.put(key, body, duration * 1000)
      res.sendResponse(body)
    }
    next()

  }
}
/* eslint-enable */

export default (app) => {
  app.get('/', cache(600), (req, res, next) => {
    next()
  })
}
