import Cookies from 'js-cookie'
import fs from 'fs'
import path from 'path'

const rootDir = path.resolve(__dirname, '../../../../')
// import { loadTranslations, setLocale, syncTranslationWithStore } from 'react-redux-i18n'

const LOAD_LOCALE = 'abroadwith/LOAD_LOCALE'
const LOAD_LOCALE_SUCCESS = 'abroadwith/LOAD_LOCALE_SUCCESS'
const LOAD_LOCALE_FAIL = 'abroadwith/LOAD_LOCALE_FAIL'
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
        loading: false,
        loaded: true,
        translations: action.locale,
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

export function loadLocaleFromFileSystem(locale) {

  console.log('is this running')

  return dispatch => {
    try {

      const localeData = JSON.parse(fs.readFileSync(rootDir + '/build/locales/' + locale + '.json', 'utf8'))
      console.log(localeData)

      dispatch({ type: LOAD_LOCALE_SUCCESS, locale: localeData })

    } catch (err) {

      dispatch({ type: LOAD_LOCALE_FAIL })

    }
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
