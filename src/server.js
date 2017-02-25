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
import path from 'path'
import PrettyError from 'pretty-error'
import React from 'react'
import ReactDOM from 'react-dom/server'
import i18nMiddleware from 'i18next-express-middleware'
import { I18nextProvider } from 'react-i18next'
import imageUploadInstaller from 'utils/upload/ImageUploadInstaller'
import UILanguages from 'data/constants/UILanguages'

// Custom API imports
import contactForm from 'helpers/api/contactForm'
import getRoomCalendar from 'helpers/api/getRoomCalendar'
import logout from 'helpers/api/logout'
import homestaySearch from 'helpers/api/homestaySearch'

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

// Install custom API endpoints
const customApiEndpoints = [contactForm, getRoomCalendar, logout, homestaySearch]
customApiEndpoints.map(endpoint => {
  endpoint(app)
})

// Install image upload endpoints
imageUploadInstaller(app)

app.use(cookieParser())
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
  // const JWT = 'eyJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJhYnJvYWR3aXRoIGFkbWluIHNlcnZlciIsImF1ZCI6ImFicm9hZHdpdGggYWRtaW4gYXBpIiwianRpIjoibFIxSHpEM2FKeXRTUFhsYjVtTG5TUSIsImlhdCI6MTQ4ODA1MjQ0OCwiZXhwIjoxNDg4NjU3MjQ4LCJuYmYiOjE0ODgwNTIzMjgsInN1YiI6IlVTRVIiLCJlbWFpbCI6ImlzYWFjQGFicm9hZHdpdGguY29tIiwibmFtZSI6IklzYWFjIiwicmlkIjoxMDA1MzMsImNiayI6MCwid2hvc3QiOnRydWUsImltZyI6Ii91c2Vycy8xMDA1MzMvMTQ4NzUyNjc4NzYwMi5qcGcifQ.Yu4lEa9ugN-RSxBzLVhkQEZpAPMUo-bOa_5YSzEtUUy7DR-cziMZELXdfVdhSR3ySlYOqNX7UMn9clhL3otNj5h3J0Afkm0Yh6l3MDc0x5iBDDXPv6q9o1c-tXD72Kp435isd0LCd21zHQzrAdpTcjbl5GyWSNi_0nOtzWlfom2qlZPIvPRYIsCEwq1Ka5XCdzY2nmaPY5FbGg7B_W9gDu1WQ6FePbFH88y9ZbwaO-ATN_iZh5Blyv_tweNLDhti5yASveyYDTdhiRrN2UWox6cxT5TCpGFxQTplyQcx3L-PZJiM5DnIrT66THX4d_zUIYHCb3gnXxqL5NaIu-lVwg'
  // const expiryDate = new Date()
  // expiryDate.setDate(expiryDate.getDate() + 7)
  // res.cookie('access_token', JWT, { maxAge: 604800000, expires: expiryDate })
  /* eslint-enable */

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

          res.send('<!doctype html>\n' +
            ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store} i18n={i18nClient} />))
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

  console.log(req.cookies.access_token)

  if (req.cookies.access_token) {

    // If user has an access_token cookie, log them in before rendering the page
    store.dispatch(loadAuth(req.cookies.access_token)) // synchronous action
    initProcedure.push(dispatch(loadUserWithAuth(req.cookies.access_token)))

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
