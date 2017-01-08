import Cookies from 'js-cookie'
import superagent from 'superagent'
import i18n from '../../../i18n/i18n-client.js'

// Load locale
const LOAD_LOCALE = 'abroadwith/LOAD_LOCALE'
const LOAD_LOCALE_SUCCESS = 'abroadwith/LOAD_LOCALE_SUCCESS'
const LOAD_LOCALE_FAIL = 'abroadwith/LOAD_LOCALE_FAIL'

// Change locale (must be loaded first)
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
    case LOAD_LOCALE:
      return {
        ...state,
        loading: true,
      }
    case LOAD_LOCALE_SUCCESS:
      return {
        ...state,
        loading: true,
        loaded: true,
      }
    case LOAD_LOCALE_FAIL:
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

export function loadLocale(locale, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return dispatch => {
    try {

      const request = superagent.get(`/locales/${locale}.json`)
      request.end((err, res) => {

        window.__i18n = {
          locale,
          translations: JSON.parse(res.text),
        }

        i18n.addResourceBundle(window.__i18n.locale, 'translation', window.__i18n.translations, true)
        i18n.changeLanguage(window.__i18n.locale)

        cb(locale)

      })

    } catch (err) {

      dispatch({ type: LOAD_LOCALE_FAIL })

    }
  }
}

export function changeLocale(locale, setCookie) {
  return dispatch => {
    try {

      dispatch({ type: CHANGE_LOCALE })

      // To Do: validate locale format

      if (setCookie) {

        // A boolean to control the setting of the cookie will be passed on client-side calls
        Cookies.set('ui_language', locale)
        dispatch(loadLocale(locale, () => {
          dispatch({ type: CHANGE_LOCALE_SUCCESS, locale })
          dispatch({ type: LOAD_LOCALE_SUCCESS })
        }))

      } else {

        // No cookie for server-side
        dispatch({ type: CHANGE_LOCALE_SUCCESS, locale })

      }


    } catch (err) {

      dispatch({ type: CHANGE_LOCALE_FAIL, err })

    }
  }
}
