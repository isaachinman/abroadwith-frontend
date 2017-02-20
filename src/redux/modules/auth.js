// Absolute imports
import jwtDecode from 'jwt-decode'
import moment from 'moment'
import config from 'config.js'
import superagent from 'superagent'
import { load as loadUserWithAuth } from 'redux/modules/privateData/users/loadUserWithAuth'
import { load as loadHomeWithAuth } from 'redux/modules/privateData/homes/loadHomeWithAuth'
import { REHYDRATE } from 'redux-persist/constants'

// Load previously stored auth
const LOAD = 'abroadwith/LOAD_AUTH'
const LOAD_SUCCESS = 'abroadwith/LOAD_AUTH_SUCCESS'
const LOAD_FAIL = 'abroadwith/LOAD_AUTHFAIL'

// Login stuff
const LOGIN = 'abroadwith/LOGIN'
const LOGIN_SUCCESS = 'abroadwith/LOGIN_SUCCESS'
const LOGIN_FAIL = 'abroadwith/LOGIN_FAIL'

// Logout stuff
const LOGOUT = 'abroadwith/LOGOUT'
const LOGOUT_SUCCESS = 'abroadwith/LOGOUT_SUCCESS'
const LOGOUT_FAIL = 'abroadwith/LOGOUT_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    // This is a rehydration (from localstore) case
    case REHYDRATE: {
      const incoming = action.payload.auth
      if (incoming) return { ...state, ...incoming }
      return state
    }
    case LOAD:
      return {
        ...state,
        loading: true,
      }
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        jwt: jwtDecode(action.jwt),
        token: action.jwt,
        error: false,
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: true,
        errorMessage: action.error,
      }
    case LOGIN:
      return {
        ...state,
        loaded: false,
        loggingIn: true,
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        loaded: true,
        loggingIn: false,
        jwt: jwtDecode(action.jwt),
        token: action.jwt,
      }
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        error: true,
        errorMessage: action.error,
      }
    case LOGOUT:
      return {
        ...state,
        loggingOut: true,
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null,
        jwt: null,
      }
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        error: true,
        errorMessage: action.error,
      }
    default:
      return state
  }
}

export function isLoaded(globalState) {

  const authIsLoaded = globalState.jwt && globalState.auth && globalState.auth.loaded
  return authIsLoaded

}

// This function is primarily serverside
export function load(jwt, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return dispatch => {

    dispatch({ type: LOAD })

    try {

      // Ensure validity
      if (moment(jwtDecode(jwt).exp * 1000).isBefore(moment())) {
        dispatch({ type: LOAD_FAIL, err: 'jwt expired' })
      } else {
        dispatch({ type: LOAD_SUCCESS, jwt })
        cb()
      }

    } catch (err) {
      dispatch({ type: LOAD_FAIL, err })
    }

  }

}

export function login(email, password, facebookToken, googleToken, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {

    dispatch({ type: LOGIN })

    try {

      const request = superagent.post(`${config.apiHost}/users/login`)

      // Determine what sort of login to perform
      if (email && password) {
        request.send({
          email,
          password,
        })
      } else if (email && facebookToken) {
        request.send({
          email,
          facebookToken,
        })
      } else if (email && googleToken) {
        request.send({
          email,
          googleToken,
        })
      }

      request.withCredentials()

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: LOGIN_FAIL, err })

        } else if (body && body.token) {

          // Login was successful
          const jwt = body.token
          dispatch({ type: LOGIN_SUCCESS, jwt })
          cb()

          // Now fetch full private info on user
          dispatch(loadUserWithAuth(jwt, response => {

            // If user has a home (or multiple homes), get that info too
            const { homeIds } = response

            if (homeIds.constructor === Array && homeIds.length > 0) {
              homeIds.map(homeID => dispatch(loadHomeWithAuth(jwt, homeID)))
            }

          }))

        } else {

          dispatch({ type: LOGIN_FAIL, err: 'Unknown error' })

        }

      })

    } catch (err) {
      dispatch({ type: LOGIN_FAIL, err })
    }
  }
}

export function facebookLogin(email, facebookToken, callback) {
  return async dispatch => {
    dispatch(login(email, null, facebookToken, null, callback))
  }
}

export function googleLogin(email, googleToken, callback) {
  return async dispatch => {
    dispatch(login(email, null, null, googleToken, callback))
  }
}

export function logout() {
  localStorage.clear()
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: () => fetch(new Request('/logout'), {
      method: 'POST',
      credentials: 'include',
    }),
  }
}
