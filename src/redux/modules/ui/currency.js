import Cookies from 'js-cookie'
import superagent from 'superagent'

// Load currency rates
const LOAD_CURRENCY_RATES = 'abroadwith/LOAD_CURRENCY_RATES'
const LOAD_CURRENCY_RATES_SUCCESS = 'abroadwith/LOAD_CURRENCY_RATES_SUCCESS'
const LOAD_CURRENCY_RATES_FAIL = 'abroadwith/LOAD_CURRENCY_RATES_FAIL'

// Change currency
const CHANGE_CURRENCY = 'abroadwith/CHANGE_CURRENCY'
const CHANGE_CURRENCY_SUCCESS = 'abroadwith/CHANGE_CURRENCY_SUCCESS'
const CHANGE_CURRENCY_FAIL = 'abroadwith/CHANGE_CURRENCY_FAIL'

const initialState = {
  loaded: false,
  exchangeRates: {
    loading: false,
    loaded: false,
  },
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_CURRENCY_RATES:
      return {
        ...state,
        exchangeRates: {
          loading: true,
          loaded: false,
        },
      }
    case LOAD_CURRENCY_RATES_SUCCESS:
      return {
        ...state,
        exchangeRates: {
          data: action.result,
          loading: false,
          loaded: true,
        },
      }
    case LOAD_CURRENCY_RATES_FAIL:
      return {
        ...state,
        exchangeRates: {
          error: action.error,
          loading: false,
          loaded: false,
        },
      }
    case CHANGE_CURRENCY:
      return {
        ...state,
        loading: true,
      }
    case CHANGE_CURRENCY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        value: action.currency,
      }
    case CHANGE_CURRENCY_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      }
    default:
      return state
  }
}

export function changeCurrency(currency, setCookie, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return dispatch => {

    dispatch({ type: CHANGE_CURRENCY })

    try {

      // To Do: validate currency format

      // A boolean to control the setting of the cookie will be passed on client-side calls
      if (setCookie) {
        Cookies.set('ui_currency', currency)
      }

      dispatch({ type: CHANGE_CURRENCY_SUCCESS, currency })
      cb()

    } catch (err) {

      dispatch({ type: CHANGE_CURRENCY_FAIL, err })

    }
  }
}

// This function is primarily called by the server on initial session request,
// but can be called on the client if the SSR call fails
export function loadCurrencyRates(callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {

    dispatch({ type: LOAD_CURRENCY_RATES })

    try {

      // Daily currency rates are fetched and stored on an s3 bucket by an external application
      const request = superagent.get('https://d9fbkd6o04txh.cloudfront.net/latest.json')
      request.end((error, response = {}) => {

        if (error) {

          dispatch({ type: LOAD_CURRENCY_RATES_FAIL, error })
          cb()

        } else {

          // GET was successful
          dispatch({ type: LOAD_CURRENCY_RATES_SUCCESS, result: JSON.parse(response.text) })
          cb()

        }

      })

    } catch (error) {
      dispatch({ type: LOAD_CURRENCY_RATES_FAIL, error })
      cb()
    }
  }
}
