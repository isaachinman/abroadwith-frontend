import Cookies from 'js-cookie'

const CHANGE_LOCALE = 'abroadwith/CHANGE_LOCALE'
const CHANGE_LOCALE_SUCCESS = 'abroadwith/CHANGE_LOCALE_SUCCESS'
const CHANGE_LOCALE_FAIL = 'abroadwith/CHANGE_LOCALE_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return {
        ...state,
        loading: true,
      }
    case CHANGE_LOCALE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        value: action.locale,
      }
    case CHANGE_LOCALE_FAIL:
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

export function changeLocale(locale, setCookie) {
  return dispatch => {
    try {

      // To Do: validate locale format

      // A boolean to control the setting of the cookie will be passed on client-side calls
      if (setCookie) {
        Cookies.set('ui_language', locale)
      }

      dispatch({ type: CHANGE_LOCALE_SUCCESS, locale })

    } catch (err) {

      dispatch({ type: CHANGE_LOCALE_FAIL, err })

    }
  }
}
