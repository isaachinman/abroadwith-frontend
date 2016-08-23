// --------------------------------------------------------------------------------
// This is the entry point for the client
// --------------------------------------------------------------------------------

// Absolute imports
import 'babel-polyfill'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
import { ReduxAsyncConnect } from 'redux-async-connect'
import { syncHistoryWithStore } from 'react-router-redux'
import React from 'react'
import ReactDOM from 'react-dom'

// Relative imports
import ApiClient from './helpers/ApiClient'
import createStore from './redux/create'
import DevTools from './containers/DevTools/DevTools'
import getRoutes from './routes'

const client = new ApiClient()
const dest = document.getElementById('content')
const store = createStore(browserHistory, client, window.__data)
const history = syncHistoryWithStore(browserHistory, store)

const component = (
  <Router
    render={(props) => <ReduxAsyncConnect {...props} helpers={{ client }} filter={item => !item.deferred} />}
    history={history}
  >
    {getRoutes(store)}
  </Router>
)

ReactDOM.render(
  <Provider store={store} key='provider'>
    {component}
  </Provider>,
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
    <Provider store={store} key='provider'>
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    dest
  )
}
