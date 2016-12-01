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
      console.log(action.currency)
      return {
        ...state,
        loading: false,
        loaded: true,
        CURRENCY: action.currency,
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

export function changeCurrency(currency) {
  return dispatch => {
    try {

      // To Do: validate currency format
      dispatch({ type: CHANGE_CURRENCY_SUCCESS, currency })

    } catch (err) {

      dispatch({ type: CHANGE_CURRENCY_FAIL, err })

    }
  }
}
