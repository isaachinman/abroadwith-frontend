/* eslint no-undef: 0 */

// Absolute imports
import { match } from 'react-router'
import { Provider } from 'react-redux'
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect'
import { syncHistoryWithStore } from 'react-router-redux'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import createHistory from 'react-router/lib/createMemoryHistory'
import Express from 'express'
import http from 'http'
import httpProxy from 'http-proxy'
import path from 'path'
import PrettyError from 'pretty-error'
import React from 'react'
import ReactDOM from 'react-dom/server'
import i18nMiddleware from 'i18next-express-middleware'
import { I18nextProvider } from 'react-i18next'
import imageUploadInstaller from 'utils/upload/ImageUploadInstaller'

// Relative imports
import ApiClient from './helpers/ApiClient'
import config from './config'
import createStore from './redux/create'
import getRoutes from './routes'
import Html from './helpers/Html'
import { load as loadAuth } from './redux/modules/auth'
import { load as loadUserWithAuth } from './redux/modules/privateData/users/loadUserWithAuth'
import { changeCurrency } from './redux/modules/ui/currency'
import { changeLocale } from './redux/modules/ui/locale'
import i18n from './i18n/i18n-server'

const targetUrl = config.apiHost
const pretty = new PrettyError()
const app = new Express()
const server = http.createServer(app)
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  changeOrigin: true,
  secure: !(__DEVELOPMENT__),
})

app.use(compression())
app.use(cookieParser())
app.use(i18nMiddleware.handle(i18n))
imageUploadInstaller(app)

app.use(Express.static(path.join(__dirname, '..', 'build')))

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res, { target: targetUrl })
})

// This is the logout endpoint
app.post('/logout', (req, res) => {

  // Remove the access_token cookie
  res.cookie('access_token', 'null', { secure: true, httpOnly: true, expires: new Date(0), domain: '.test-abroadwith.com' })
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
  // const JWT = 'eyJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJhYnJvYWR3aXRoIGFkbWluIHNlcnZlciIsImF1ZCI6ImFicm9hZHdpdGggYWRtaW4gYXBpIiwianRpIjoiT0I1UjlEaUJjY3hjYjY1Vzk2bnVXZyIsImlhdCI6MTQ4MjAwNjkyMSwiZXhwIjoxNDgyNjExNzIxLCJuYmYiOjE0ODIwMDY4MDEsInN1YiI6IlVTRVIiLCJlbWFpbCI6ImlzYWFjQGFicm9hZHdpdGguY29tIiwibmFtZSI6IklzYWFjIiwicmlkIjoxMDA1MDEsImNiayI6MSwid2hvc3QiOmZhbHNlLCJpbWciOiIvdXNlcnMvMTAwNTAxLzE0ODE3OTYzOTI5OTQuanBlZyJ9.ktPq9M1HsuuZfhZsv4xFT3MbOqdOWArZB0bZEiGrvJdELKt_h8njve_fofZpq52Fa6Er2JvCYzDt6qAFWN0JP-xqz0HmmYWx5Nl0UirXk3ni5ojqQxUJ58GnEgLtU6dW_sCl85kjJb-qucwagGW7GvkyqK05jVTXwfB0Yvkolg4H03FGb6XpuzjXctP0MjwPnUObvWyy4M7lq0r94cXvTzoNe6XvV71vY0dsxnFYx9IzPqOQonSbKODbZ4oC0MhEwsPnacnCF0IqUpj-4upPcHUB-ycGsHoyvPbdyO8J5ajobVUPP3PsyP2kCFTHX6vAlfmrPX7NB7fG0krgXAeLWg'
  // const expiryDate = new Date()
  // expiryDate.setDate(expiryDate.getDate() + 7)
  // res.cookie('access_token', JWT, { maxAge: 604800000, expires: expiryDate })
  // res.cookie('ui_currency', 'EUR')
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

  // --------------------------------------------------------------------------------
  // This is where we will do all the custom rendering and external calls necessary
  // --------------------------------------------------------------------------------

  // If user has a ui_language cookie, set their appropriate language.
  if (req.cookies.ui_currency) {
    store.dispatch(changeCurrency(req.cookies.ui_currency))
  } else {
    store.dispatch(changeCurrency('EUR'))
  }

  // If user has a ui_language cookie, set their appropriate language.
  if (req.cookies.ui_language) {
    store.dispatch(changeLocale(req.cookies.ui_language))
  } else {
    store.dispatch(changeLocale('en'))
  }

  // Now initialise i18n
  const locale = store.getState().ui.locale.value
  const translations = i18n.getResourceBundle(locale)
  const i18nClient = { locale, translations }
  const i18nServer = i18n.cloneInstance()
  i18nServer.changeLanguage(locale)

  const renderFunction = () => match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {

      res.redirect(redirectLocation.pathname + redirectLocation.search)

    } else if (error) {

      console.error('ROUTER ERROR:', pretty.render(error))
      res.status(500)
      hydrateOnClient()

    } else if (renderProps) {

      loadOnServer({ ...renderProps, store, helpers: { client } }).then(() => {

        const component = (
          <I18nextProvider i18n={i18nServer}>
            <Provider store={store} key='provider'>
              <ReduxAsyncConnect {...renderProps} />
            </Provider>
          </I18nextProvider>
        )

        res.status(200)

        global.navigator = { userAgent: req.headers['user-agent'] }

        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store} i18n={i18nClient} />))
      })

    } else {
      res.status(404).send('Not found')
    }
  })

  if (req.cookies.access_token) {

    // If user has an access_token cookie, log them in before rendering the page
    store.dispatch(loadAuth(req.cookies.access_token))
    store.dispatch(loadUserWithAuth(req.cookies.access_token, renderFunction, store.dispatch)) // eslint-disable-line

  } else {

    // Otherwise just render the page
    renderFunction()

  }

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
