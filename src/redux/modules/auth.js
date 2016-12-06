// Absolute imports
import jwtDecode from 'jwt-decode'
import moment from 'moment'
import config from 'config.js'
import superagent from 'superagent'
import { load as loadUserWithAuth } from 'redux/modules/privateData/users/loadUserWithAuth'
import { load as loadHomeWithAuth } from 'redux/modules/privateData/homes/loadHomeWithAuth'

// Load previously stored auth
const LOAD = 'auth/LOAD'
const LOAD_SUCCESS = 'auth/LOAD_SUCCESS'
const LOAD_FAIL = 'auth/LOAD_FAIL'

// Login stuff
const LOGIN = 'auth/LOGIN'
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS'
const LOGIN_FAIL = 'auth/LOGIN_FAIL'

// Logout stuff
const LOGOUT = 'auth/LOGOUT'
const LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS'
const LOGOUT_FAIL = 'auth/LOGOUT_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
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

// export function loadAllUserInfo(globalState) {
//   return console.log(globalState)
// }

export function isLoaded(globalState) {

  const authIsLoaded = globalState.jwt && globalState.auth && globalState.auth.loaded
  return authIsLoaded

}

export function load(jwt) {

  // Ensure validity
  if (moment(jwtDecode(jwt).exp * 1000).isBefore(moment())) {
    console.log('its expired')
    return {
      type: LOAD_FAIL,
      error: 'jwt expired',
    }
  }

  console.log('its not expired')
  return {
    type: LOAD_SUCCESS,
    jwt,
  }

}

export function login(email, password, facebookToken, googleToken) {
  return async dispatch => {
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

          // Now fetch full private info on user
          dispatch(loadUserWithAuth(jwt))

          // If user has a home, get that info too
          if (jwtDecode(jwt).hid) {
            dispatch(loadHomeWithAuth(jwt))
          }
        } else {

          dispatch({ type: LOGIN_FAIL, err: 'Unknown error' })

        }

      })

    } catch (err) {
      dispatch({ type: LOGIN_FAIL, err })
    }
  }
}

export function facebookLogin(email, facebookToken) {
  return async dispatch => {
    dispatch(login(email, null, facebookToken, null))
  }
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: () => fetch(new Request('/logout'), {
      method: 'POST',
      credentials: 'include',
    }),
  }
}
