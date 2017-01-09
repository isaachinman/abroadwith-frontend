import Cookies from 'js-cookie'

const CHANGE_CURRENCY = 'abroadwith/CHANGE_CURRENCY'
const CHANGE_CURRENCY_SUCCESS = 'abroadwith/CHANGE_CURRENCY_SUCCESS'
const CHANGE_CURRENCY_FAIL = 'abroadwith/CHANGE_CURRENCY_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
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

  console.log('inside currency dispatch')

  return dispatch => {
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
