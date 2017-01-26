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
import UILanguages from 'data/constants/UILanguages'

// Custom API imports
import getRoomCalendar from 'helpers/api/getRoomCalendar'
import logout from 'helpers/api/logout'

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

// Install custom API endpoints
const customApiEndpoints = [getRoomCalendar, logout]
customApiEndpoints.map(endpoint => {
  endpoint(app)
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
  // const JWT = 'eyJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJhYnJvYWR3aXRoIGFkbWluIHNlcnZlciIsImF1ZCI6ImFicm9hZHdpdGggYWRtaW4gYXBpIiwianRpIjoiR3NUaWluczNMdEYxSW9pYTFGT2JTQSIsImlhdCI6MTQ4NTMzNjEyMiwiZXhwIjoxNDg1OTQwOTIyLCJuYmYiOjE0ODUzMzYwMDIsInN1YiI6IlVTRVIiLCJlbWFpbCI6Im1hdGhldXNAYWJyb2Fkd2l0aC5jb20iLCJuYW1lIjoiTWF0aGV1cyIsInJpZCI6Mzg5LCJjYmsiOjAsIndob3N0Ijp0cnVlLCJpbWciOiIvdXNlcnMvMzg5LzE0Nzg3ODM4Mjc1NzEuanBnIiwiaGlkIjoxMzJ9.oYe_P1U_e3mAEQPVm-YYHpOrSpKvK8FbyFa3dNLWXpUNM7KXJc2VhGAiELM-syO8l7AL5_CL_vSRNBNGKCCzphUqymI1nmoMET7tyTHQmPYunPoZ0Z8iBLpxgJGLclNInNZwllr0-fkEDrw5j0XxZKw_kkZCDzO-p7sdyVn69zct6bGce2ZRgAC9krDGV_I74D7KZqfPzW8mp_IW9sCmMfQ9PtP5ZMmRZ4URvhb2fco0NpB2yD3-sdZ1AA0URpvJl--CbBjiHB1E_RyKnIysN7y6_-2cPeS8F0gizy6GMycR61qooaO9hX6nmoQqBh-sB0ku2NXHZQ7l0vqBGe3Cnw'
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
  const { dispatch } = store

  // If user has a currency cookie, set their appropriate language.
  let currencyDispatch = cb => cb()
  if (!req.cookies.ui_currency) {
    currencyDispatch = cb => dispatch(changeCurrency('EUR', null, cb))
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
