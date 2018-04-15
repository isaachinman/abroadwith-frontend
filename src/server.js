/* eslint no-undef: 0 */

// Absolute imports
import { match } from 'react-router'
import { Provider } from 'react-redux'
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect'
import { syncHistoryWithStore } from 'react-router-redux'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import createHistory from 'react-router/lib/createMemoryHistory'
import Express from 'express'
import http from 'http'
import httpProxy from 'http-proxy'
import jwtDecode from 'jwt-decode'
import logger from 'helpers/logger'
import moment from 'moment'
import path from 'path'
import PrettyError from 'pretty-error'
import React from 'react'
import ReactDOM from 'react-dom/server'
import i18nMiddleware from 'i18next-express-middleware'
import { I18nextProvider } from 'react-i18next'
import imageUploadInstaller from 'utils/upload/ImageUploadInstaller'
import UILanguages from 'data/constants/UILanguages'

// Custom API imports
import { contactForm, errorHandler, getAllEducatorCourses, getClosestCity, getCourseCities, getCourseLanguages, getRoomCalendar, homestaySearch, logout } from 'helpers/api'

import serverCache from 'helpers/serverCache'

// Session invalidator
// import sessionInvalidator from 'helpers/sessionInvalidator'

// Relative imports
import ApiClient from './helpers/ApiClient'
import config from './config'
import createStore from './redux/create'
import getRoutes from './routes'
import Html from './helpers/Html'
import { load as loadAuth } from './redux/modules/auth'
import { load as loadUserWithAuth } from './redux/modules/privateData/users/loadUserWithAuth'
import { changeCurrency, loadCurrencyRates } from './redux/modules/ui/currency'
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

// Use bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// User cookieParser
app.use(cookieParser())

if (process.env.NODE_ENV !== 'development') {
  // Cache public pages into memory
  serverCache(app)
}

if (process.env.NODE_ENV === 'production') {
  // Set cache headers for assets (one month)
  app.get('/dist/*.(js|css)', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=2592000')
    res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString())
    next()
  })
}

// Install custom API endpoints
const customApiEndpoints = [contactForm, errorHandler, getAllEducatorCourses, getClosestCity, getCourseCities, getCourseLanguages, getRoomCalendar, logout, homestaySearch]
customApiEndpoints.map(endpoint => {
  endpoint(app)
})

// Use invalidator
// sessionInvalidator(app)

// Install image upload endpoints
imageUploadInstaller(app)

app.use(i18nMiddleware.handle(i18n))

app.use(Express.static(path.join(__dirname, '..', 'build')))

// Proxy to API server
// Not 100% sure if this will see continued use
app.use('/api', (req, res) => {
  proxy.web(req, res, { target: targetUrl })
})

// Error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
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
   /*const JWT = 'eyJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJhYnJvYWR3aXRoIGFkbWluIHNlcnZlciIsImF1ZCI6ImFicm9hZHdpdGggYWRtaW4gYXBpIiwianRpIjoiY2hUcnpKVS1mZ01uTjU3WEhYUDI2QSIsImlhdCI6MTQ5NDAwMDg2NywiZXhwIjoxNDk0NjA1NjY3LCJuYmYiOjE0OTQwMDA3NDcsInN1YiI6IlVTRVIiLCJlbWFpbCI6ImlzYXF1ZUBhYnJvYWR3aXRoLmNvbSIsIm5hbWUiOiJJc2FxdWUiLCJyaWQiOjEwMDYzMCwiaGlkIjo2MjV9.oica3nUyqNhfRftIu7IXbY1zZDhjHToMmDRHTVIKWA6_951XmeRmUnslegjRQ9mqz8Vp34V_k88qujpyeS_geqP7DH5pJ0qA_PKcNZd7NO6_ExOs4qEAfPJa5zszM23R26VDLMCkKGNvWewqACq7tdjHbfB6guCjmWUcYi3c0Q5cZ-JGajxQISwrRVDvQpI3cmyqL2nCNI5ymvkcPzfaJvxu9fqwRaBVP9s35ScOlT2ocD4tD56HhNUsrYZwkFp45D4A8gnnBqyjrguAJ-8jz72OQoWE3xKe4h88QwIhrYt2ZEehVb6P5o7UQnRVDXazFE2drGVwJGyriWNOpNBlWA'
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 30)
  res.cookie('access_token', JWT, { maxAge: 604800000, expires: expiryDate })*/
  /* eslint-enablek */

  // Log requests in production to S3 bucket
  const loggedIn = typeof req.cookies.access_token === 'string'
  logger.info({
    type: 'Session initialisation',
    routeRequested: req.originalUrl,
    loggedIn,
    jwt: loggedIn ? jwtDecode(req.cookies.access_token) : null,
  })

  if (__DEVELOPMENT__) {

    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh()

  }

  // Helper middleware
  const client = new ApiClient(req)

  // Create and sync history with store
  const memoryHistory = createHistory(req.originalUrl)
  const store = createStore(memoryHistory, client)
  const history = syncHistoryWithStore(memoryHistory, store)

  // The all-important renderToString for SSR
  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store} />))
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient()
    return
  }

  const renderFunction = () => match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {

    const locale = store.getState().ui.locale.value
    const i18nServer = i18n.cloneInstance()
    i18nServer.changeLanguage(locale, () => {

      const i18nClient = {
        locale,
        translations: i18n.getResourceBundle(locale),
      }

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
          res.send('<!doctype html>\n' + ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store} i18n={i18nClient} />))

        })

      } else {
        res.status(404).send('Not found')
      }
    })

  })

  // ---------------------------------------------------------------------------------------------
  // This is where we will do all the custom rendering and external calls necessary for
  // app initialisation. If a new action needs to be added, simply push it into the array.
  // ---------------------------------------------------------------------------------------------
  const { dispatch } = store
  const initProcedure = []

  // CURRENCY PROCEDURE --------------------------------------------------------

  // First, load conversion rates
  initProcedure.push(dispatch(loadCurrencyRates()))

  // If user has a currency cookie, set their appropriate language
  if (!req.cookies.ui_currency) {

    // Assign EUR as default
    initProcedure.push(dispatch(changeCurrency('EUR', null)))

    // Set cookie
    res.cookie('ui_currency', 'EUR')

  } else {

    // Otherwise, use the cookie value
    initProcedure.push(dispatch(changeCurrency(req.cookies.ui_currency, null)))

  }

  // LANGUAGE PROCEDURE --------------------------------------------------------

  // If user has a language cookie, set their appropriate language
  if (req.cookies.ui_language && store.getState().ui.locale.value !== req.cookies.ui_language) {

    initProcedure.push(dispatch(changeLocale(req.cookies.ui_language, null)))

  } else {

    // If the user has no cookie, check if they landed on a non-English url
    let foreignLanguage = false
    Object.values(UILanguages).map(language => {
      if (language.iso2 !== 'en' && req.originalUrl.indexOf(language.basepath) > -1) {
        foreignLanguage = true
        initProcedure.push(dispatch(changeLocale(language.iso2, null)))
      }
    })

    // Otherwise set language to English
    if (!foreignLanguage) {
      initProcedure.push(dispatch(changeLocale('en', null)))
    }

  }

  if (req.cookies.access_token) {

    // Ensure validity
    if (!moment(jwtDecode(req.cookies.access_token).exp * 1000).isBefore(moment())) {

      // If user has an access_token cookie, log them in before rendering the page
      store.dispatch(loadAuth(req.cookies.access_token)) // synchronous action
      initProcedure.push(dispatch(loadUserWithAuth(req.cookies.access_token)))

    }

  }

  // Finally, render the page
  Promise.all(initProcedure).then(() => renderFunction())


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
