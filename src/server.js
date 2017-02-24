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

app.use(cookieParser())
app.use(i18nMiddleware.handle(i18n))
imageUploadInstaller(app)

app.use(Express.static(path.join(__dirname, '..', 'build')))

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res, { target: targetUrl })
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
  // const JWT = 'eyJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJhYnJvYWR3aXRoIGFkbWluIHNlcnZlciIsImF1ZCI6ImFicm9hZHdpdGggYWRtaW4gYXBpIiwianRpIjoiZ0tZNGwzUmlyOTJWUGdlRll1eGpHdyIsImlhdCI6MTQ4Nzg0MTM5OSwiZXhwIjoxNDg4NDQ2MTk5LCJuYmYiOjE0ODc4NDEyNzksInN1YiI6IlVTRVIiLCJlbWFpbCI6ImlzYWFjc2hpbm1hbkBnbWFpbC5jb20iLCJuYW1lIjoiSXNhYWMiLCJyaWQiOjEwMDU1MywiY2JrIjoyLCJ3aG9zdCI6dHJ1ZSwiaW1nIjoiL3VzZXJzLzEwMDU1My8xNDg3NzYzNjA0MjIwLmpwZWciLCJoaWQiOjU1MX0.AGN9UTWStJviPye9mR7PNl02bG_e_gS7874bVQgf2VcQHt8XoNFREXuotM_DXFxPIUSxYtkFCLxuhXBR8-cEppWn1cd6E-gGYsUer-WplnPwxIwU3-Kwf9ynYcsjTXFzIXSoN379UukiZWlnGyBesR2a2Aajqv0XGAsNAs1o0KjbUcNbAdeVA9ar0TwrUj2iP0Tt796kZKHiBNuy-IiCxWOO7sGp5bMWXUajwwZsbPP9MmbW5_QiVeNaRK7E9bT8wUhYART19JXR8jnY8BwM0abFpPt0MbMGf1HFsc-vpelClJ9oqv1Pi4OIYBSmOlsbxwZ_0jzMo95l9MPp2zuHAg'
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

  // ---------------------------------------------------------------------------------------------
  // This is where we will do all the custom rendering and external calls necessary
  // It's messy, it needs refactoring with some specific methodology, thunks or something similar
  // ---------------------------------------------------------------------------------------------
  const { dispatch } = store

  // If user has a currency cookie, set their appropriate language.
  let currencyDispatch = cb => cb()
  if (!req.cookies.ui_currency) {
    currencyDispatch = cb => dispatch(loadCurrencyRates(() => dispatch(changeCurrency('EUR', null, cb))))
    res.cookie('ui_currency', 'EUR')
  } else {
    currencyDispatch = cb => dispatch(loadCurrencyRates(() => dispatch(changeCurrency(req.cookies.ui_currency, null, cb))))
  }

  // If user has a language cookie, set their appropriate language.
  let languageDispatch = cb => cb()
  if (req.cookies.ui_language && store.getState().ui.locale.value !== req.cookies.ui_language) {
    languageDispatch = cb => dispatch(changeLocale(req.cookies.ui_language, null, cb))
  } else {

    // If the user has no cookie, check if they landed on a non-English url
    let foreignLanguage = false
    Object.values(UILanguages).map(language => {
      if (language.iso2 !== 'en' && req.originalUrl.indexOf(language.basepath) > -1) {
        foreignLanguage = true
        languageDispatch = cb => dispatch(changeLocale(language.iso2, null, cb))
      }
    })

    // Otherwise set language to English
    if (!foreignLanguage) {
      languageDispatch = cb => dispatch(changeLocale('en', null, cb))
    }

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

  if (req.cookies.access_token) {

    // If user has an access_token cookie, log them in before rendering the page
    store.dispatch(loadAuth(req.cookies.access_token)) // synchronous action
    store.dispatch(loadUserWithAuth(req.cookies.access_token, null, currencyDispatch.bind(null, languageDispatch.bind(null, renderFunction))))

  } else {

    // Otherwise just render the page
    currencyDispatch(languageDispatch.bind(null, renderFunction))

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
