// --------------------------------------------------------------------------------
// This is the entry point for the client
// --------------------------------------------------------------------------------

// Absolute imports
import 'babel-polyfill'
import { browserHistory, Router, match } from 'react-router'
import { Provider } from 'react-redux'
import { ReduxAsyncConnect } from 'redux-connect'
import { syncHistoryWithStore } from 'react-router-redux'
import React from 'react'
import ReactDOM from 'react-dom'

// Translation
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/i18n-client'

// Relative imports
import ApiClient from './helpers/ApiClient'
import createStore from './redux/create'
import getRoutes from './routes'

const client = new ApiClient()
const dest = document.getElementById('content')
const store = createStore(browserHistory, client, window.__data)
const history = syncHistoryWithStore(browserHistory, store)

if (__DEVTOOLS__) {
  window.Perf = require('react-addons-perf') // eslint-disable-line
}

// Bind Google Analytics to history API
history.listen(location => {
  if (typeof window !== 'undefined' && typeof window.ga === 'function') {
    window.ga('set', 'page', location.pathname + location.search)
    window.ga('send', 'pageview')
  }

})

// If translation data has been hydrated, initialise it
if (window.__i18n) {
  i18n.changeLanguage(window.__i18n.locale)
  i18n.addResourceBundle(window.__i18n.locale, 'translation', window.__i18n.translations, true)
}

match({ routes: getRoutes(store), history: browserHistory }, (error, redirectLocation, renderProps) => {
  ReactDOM.render(
    <I18nextProvider i18n={i18n}>
      <Provider store={store} key='provider'>
        <Router
          {...renderProps}
          render={(props) => <ReduxAsyncConnect {...props} helpers={{ client }} filter={item => !item.deferred} />}
          history={history}
        >
          {getRoutes(store)}
        </Router>
      </Provider>
    </I18nextProvider>,
    dest
  )
})

if (process.env.NODE_ENV !== 'production') {
  window.React = React // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.')
  }
}

if (__DEVTOOLS__ && !window.devToolsExtension) {

  // DevTools must be required in so as to not include it in production
  const DevTools = require('./containers/DevTools/DevTools') // eslint-disable-line

  window.Perf = require('react-addons-perf') // eslint-disable-line

  match({ routes: getRoutes(store), history: browserHistory }, (error, redirectLocation, renderProps) => {
    ReactDOM.render(
      <I18nextProvider i18n={i18n}>
        <Provider store={store} key='provider'>
          <div>
            <Router
              {...renderProps}
              render={(props) => <ReduxAsyncConnect {...props} helpers={{ client }} filter={item => !item.deferred} />}
              history={history}
            >
              {getRoutes(store)}
            </Router>
            <DevTools />
          </div>
        </Provider>
      </I18nextProvider>,
      dest
    )
  })
}
