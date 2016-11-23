/* eslint no-undef: 0 */

// Absolute imports
import { match } from 'react-router'
import { Provider } from 'react-redux'
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect'
import { syncHistoryWithStore } from 'react-router-redux'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import createHistory from 'react-router/lib/createMemoryHistory'
import Express from 'express'
import http from 'http'
import https from 'https'
import httpProxy from 'http-proxy'
import path from 'path'
import PrettyError from 'pretty-error'
import React from 'react'
import ReactDOM from 'react-dom/server'

// Relative imports
import ApiClient from './helpers/ApiClient'
import config from './config'
import createStore from './redux/create'
import getRoutes from './routes'
import Html from './helpers/Html'
import { load as loadAuth } from './redux/modules/auth'

const targetUrl = config.apiHost
const pretty = new PrettyError()
const app = new Express()
const server = __DEVELOPMENT__ ? http.createServer(app) : https.createServer(app)
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  changeOrigin: true,
  secure: !(__DEVELOPMENT__),
})

app.use(compression())
app.use(cookieParser())

app.use(Express.static(path.join(__dirname, '..', 'build')))

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res, { target: targetUrl })
})

// This is the logout endpoint
app.post('/logout', (req, res) => {

  // Remove the access_token cookie
  res.cookie('access_token', 'null', { secure: true, httpOnly: true, expires: new Date(0) })
  res.header('Access-Control-Allow-Credentials', 'true')
  res.sendStatus(200)

})

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {

  let json = {} // eslint-disable-line

  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error)
  }

  if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' })
  }

  json.error = 'proxy_error'
  json.reason = error.message

  res.end(JSON.stringify(json))

})

app.use((req, res) => {

  // Uncomment these lines to set a test token
  /* eslint-disable */
  // const JWT = 'eyJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJhYnJvYWR3aXRoIGFkbWluIHNlcnZlciIsImF1ZCI6ImFicm9hZHdpdGggYWRtaW4gYXBpIiwianRpIjoieTFIeWRZbnN3MEdaV0NLdGZ4QmJQdyIsImlhdCI6MTQ3MjAyNjc3NSwiZXhwIjoxNDcyNjMxNTc1LCJuYmYiOjE0NzIwMjY2NTUsInN1YiI6IlVTRVIiLCJlbWFpbCI6IjIuMEBleGFtcGxlLmNvbSIsIm5hbWUiOiJJc2FhYyIsInJpZCI6MTAwMzgwLCJjYmsiOjMsIndob3N0IjpmYWxzZX0.nzuIvL_lwOoAuUO6bd7yD1EcBogHcpcn1M8NMEz5YIQ7G2FohjZs3MzwTrjQviuBxOJ4fSBhNVrljRBbymvGS7e_LN8DbrzgP8S-2r99sx4Tfxu8nzeyYjrjz84drvL-elA2iIrMnLJ2Yp-Za0ud3Ytq62Wz5NjQNhwyZsLwceoh8FBa1EPySusV3KxGdwCMjxTTcDaVzoFrlQ-QJ1N9esqFUaPhLqlXLMMnfkOXcwKqdMOxHpCGy8JkLMX7pmGXEHvJCmK_C-fqQSWiuh5WJVWW1O8AOvw6WbRMofXNzTHtKAtXl19Hz16E2JK-G7Ce34sMu1_OjtqnYh2OQPST1A'
  // const expiryDate = new Date()
  // expiryDate.setDate(expiryDate.getDate() + 7)
  // res.cookie('access_token', JWT, { maxAge: 604800000, expires: expiryDate })
  /* eslint-enable */

  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env

    webpackIsomorphicTools.refresh()
  }
  const client = new ApiClient(req)
  const memoryHistory = createHistory(req.originalUrl)
  const store = createStore(memoryHistory, client)
  const history = syncHistoryWithStore(memoryHistory, store)

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store} />))
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient()
    return
  }

  match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {

      res.redirect(redirectLocation.pathname + redirectLocation.search)

    } else if (error) {

      console.error('ROUTER ERROR:', pretty.render(error))
      res.status(500)
      hydrateOnClient()

    } else if (renderProps) {

      loadOnServer({ ...renderProps, store, helpers: { client } }).then(() => {

        // If user has an access_token cookie, log them in before even rendering the page
        if (req.cookies.access_token) {
          store.dispatch(loadAuth(req.cookies.access_token))
        }

        const component = (
          <Provider store={store} key='provider'>
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        )

        res.status(200)

        global.navigator = { userAgent: req.headers['user-agent'] }

        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store} />))
      })

    } else {
      res.status(404).send('Not found')
    }
  })
})

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err)
    }
    console.info('----\n==> ✅  %s is running, talking to API at %s.', config.app.title, targetUrl)
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port)
  })
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified')
}
