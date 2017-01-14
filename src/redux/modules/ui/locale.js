import { browserHistory } from 'react-router'
import Cookies from 'js-cookie'
import superagent from 'superagent'
import i18n from '../../../i18n/i18n-client.js'

// Change locale
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
        loaded: false,
        value: action.locale,
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

export function changeLocale(locale, setCookie, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return dispatch => {

    dispatch({ type: CHANGE_LOCALE, locale })

    try {

      // To Do: validate locale format

      if (setCookie) {

        // A boolean to control the setting of the cookie will be passed on client-side calls
        Cookies.set('ui_language', locale)

        // Load the necessary locale
        const request = superagent.get(`/locales/${locale}.json`)
        request.end((err, res) => {

          window.__i18n = {
            locale,
            translations: JSON.parse(res.text),
          }

          i18n.addResourceBundle(window.__i18n.locale, 'translation', window.__i18n.translations, true)
          i18n.changeLanguage(window.__i18n.locale, () => {
            dispatch({ type: CHANGE_LOCALE_SUCCESS, locale })
            browserHistory.replace(window.location.pathname)
            cb()
          })


        })

      } else {

        // No cookie for server-side
        dispatch({ type: CHANGE_LOCALE_SUCCESS, locale })
        cb()

      }


    } catch (err) {

      dispatch({ type: CHANGE_LOCALE_FAIL, err })

    }
  }
}
