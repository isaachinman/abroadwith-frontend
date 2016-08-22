import jwtDecode from 'jwt-decode'

const LOAD = 'abroadwith/auth/LOAD'
const LOAD_SUCCESS = 'abroadwith/auth/LOAD_SUCCESS'
const LOAD_FAIL = 'abroadwith/auth/LOAD_FAIL'
const LOGIN = 'abroadwith/auth/LOGIN'
const LOGIN_SUCCESS = 'abroadwith/auth/LOGIN_SUCCESS'
const LOGIN_FAIL = 'abroadwith/auth/LOGIN_FAIL'
const LOGOUT = 'abroadwith/auth/LOGOUT'
const LOGOUT_SUCCESS = 'abroadwith/auth/LOGOUT_SUCCESS'
const LOGOUT_FAIL = 'abroadwith/auth/LOGOUT_FAIL'

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
        user: action.result,
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
        loggingIn: true,
      }
    case LOGIN_SUCCESS:
      console.log('LOGGED IN SUCCESSFULLY', action)
      return {
        ...state,
        loggingIn: false,
        user: jwtDecode(action.result.token),
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
  return globalState.auth && globalState.auth.loaded
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/loadAuth'),
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
    promise: (client) => client.get('/logout'),
  }
}
