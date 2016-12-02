// --------------------------------------------------------------------------------
// This is the entry point for the client
// --------------------------------------------------------------------------------

// Absolute imports
import 'babel-polyfill'
import { browserHistory, Router } from 'react-router'
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
import DevTools from './containers/DevTools/DevTools'
import getRoutes from './routes'

const client = new ApiClient()
const dest = document.getElementById('content')
const store = createStore(browserHistory, client, window.__data)
const history = syncHistoryWithStore(browserHistory, store)

i18n.changeLanguage(window.__i18n.locale)
i18n.addResourceBundle(window.__i18n.locale, 'translation', window.__i18n.translations, true)

const component = (
  <Router
    render={(props) => <ReduxAsyncConnect {...props} helpers={{ client }} filter={item => !item.deferred} />}
    history={history}
  >
    {getRoutes(store)}
  </Router>
)

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store} key='provider'>
      {component}
    </Provider>
  </I18nextProvider>,
  dest
)

if (process.env.NODE_ENV !== 'production') {
  window.React = React // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.')
  }
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
  ReactDOM.render(
    <I18nextProvider i18n={i18n}>
      <Provider store={store} key='provider'>
        <div>
          {component}
          <DevTools />
        </div>
      </Provider>
    </I18nextProvider>,
    dest
  )
}
