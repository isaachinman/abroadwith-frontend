// Request password
const REQUEST_RESET_PASSWORD = 'abroadwith/REQUEST_RESET_PASSWORD'
const REQUEST_RESET_PASSWORD_SUCCESS = 'abroadwith/REQUEST_RESET_PASSWORD_SUCCESS'
const REQUEST_RESET_PASSWORD_FAIL = 'abroadwith/REQUEST_RESET_PASSWORD_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_RESET_PASSWORD:
      return {
        ...state,
        loading: true,
      }
    case REQUEST_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
      }
    case REQUEST_RESET_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: true,
        errorMessage: action.error,
      }
    default:
      return state
  }
}

export function requestResetPassword(email) {

  return {
    types: [REQUEST_RESET_PASSWORD, REQUEST_RESET_PASSWORD_SUCCESS, REQUEST_RESET_PASSWORD_FAIL],
    promise: client => client.post('passwords/reset', { data: { email } }),
  }

}