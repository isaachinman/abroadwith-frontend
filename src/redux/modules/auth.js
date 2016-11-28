import jwtDecode from 'jwt-decode'
import moment from 'moment'

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

// // Load full user object
// const LOAD_FULL_USER = 'auth/LOAD_FULL_USER'
// const LOAD_FULL_USER_SUCCESS = 'auth/LOAD_FULL_USER_SUCCESS'
// const LOAD_FULL_USER_FAILURE = 'auth/LOAD_FULL_USER_FAILURE'
//
// // Load full home object
// const LOAD_FULL_HOME = 'auth/LOAD_FULL_HOME'
// const LOAD_FULL_HOME_SUCCESS = 'auth/LOAD_FULL_HOME_SUCCESS'
// const LOAD_FULL_HOME_FAILURE = 'auth/LOAD_FULL_HOME_FAILURE'

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
        jwt: action.jwt,
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
        jwt: jwtDecode(action.result.token),
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

export function load(encodedJwt) {

  const jwt = jwtDecode(encodedJwt)

  // Ensure validity
  if (moment(jwt.exp * 1000).isBefore(moment())) {
    return {
      type: LOAD_FAIL,
      error: 'jwt expired',
    }
  }

  return {
    type: LOAD_SUCCESS,
    jwt,
  }
}

export function login(email, password) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/users/login', {
      data: {
        email,
        password,
      },
    }),
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
