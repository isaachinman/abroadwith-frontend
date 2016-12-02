import Cookies from 'js-cookie'
import fs from 'fs'
import path from 'path'
import superagent from 'superagent'

const rootDir = path.resolve(__dirname, '../../../../')

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

export function loadLocaleFromHttp(locale) {

  return dispatch => {
    try {

      const request = superagent.get(`/locales/${locale}.json`)
      request.end((err, res) => {
        dispatch({ type: LOAD_LOCALE_SUCCESS, locale: JSON.parse(res.text) })
      })

    } catch (err) {

      dispatch({ type: LOAD_LOCALE_FAIL })

    }
  }

}

export function loadLocaleFromFileSystem(locale) {

  return dispatch => {
    try {

      const localeData = {
        [locale]: JSON.parse(fs.readFileSync(rootDir + '/build/locales/' + locale + '.json', 'utf8')),
      }
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
        dispatch(loadLocaleFromHttp(locale))
      }

      dispatch({ type: CHANGE_LOCALE_SUCCESS, locale })

    } catch (err) {

      dispatch({ type: CHANGE_LOCALE_FAIL, err })

    }
  }
}
