// Absolute imports
import { combineReducers } from 'redux'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { routerReducer } from 'react-router-redux'
import { loadingBarReducer } from 'react-redux-loading-bar'

// Relative imports
import auth from './auth'
import clientToken from './payments/client-token'
import contactUs from './publicData/users/contactUs'
import currency from './ui/currency'
import educators from './publicData/educators/loadEducator'
import footer from './ui/footer'
import homestaySearch from './ui/search/homestaySearch'
import hoverables from './ui/search/hoverables'
import invoices from './privateData/invoices/invoices'
import locale from './ui/locale'
import { loadUserWithAuth, loadHomestayWithAuth, reservations } from './privateData/'
import { loadHomestay, loadUser } from './publicData'
import messaging from './privateData/messaging/messaging'
import modals from './ui/modals'
import receipts from './privateData/receipts/receipts'
import reviews from './privateData/reviews/reviews'
import signupStatus from './signup'
import verifications from './privateData/users/verifications'

export default combineReducers({
  auth,
  contactUs,
  loadingBar: loadingBarReducer,
  messaging,
  routing: routerReducer,
  reduxAsyncConnect,
  privateData: combineReducers({
    invoices,
    user: loadUserWithAuth,
    homes: loadHomestayWithAuth,
    receipts,
    reservations,
    reviews,
  }),
  publicData: combineReducers({
    educators,
    homestays: loadHomestay,
    users: loadUser,
  }),
  ui: combineReducers({
    currency,
    footer,
    hoverables,
    locale,
    modals,
  }),
  uiPersist: combineReducers({
    homestaySearch,
  }),
  payments: combineReducers({
    clientToken,
  }),
  signupStatus,
  verifications,
})
