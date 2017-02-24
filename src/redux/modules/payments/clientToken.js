import jwtDecode from 'jwt-decode'

// Get Braintree clientToken
const GET_BRAINTREE_CLIENT_TOKEN = 'abroadwith/GET_BRAINTREE_CLIENT_TOKEN'
const GET_BRAINTREE_CLIENT_TOKEN_SUCCESS = 'abroadwith/GET_BRAINTREE_CLIENT_TOKEN_SUCCESS'
const GET_BRAINTREE_CLIENT_TOKEN_FAIL = 'abroadwith/GET_BRAINTREE_CLIENT_TOKEN_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_BRAINTREE_CLIENT_TOKEN:
      return {
        ...state,
        loading: true,
      }
    case GET_BRAINTREE_CLIENT_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        value: action.result,
      }
    case GET_BRAINTREE_CLIENT_TOKEN_FAIL:
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

export function getBraintreeClientToken(jwt) {
  return {
    types: [GET_BRAINTREE_CLIENT_TOKEN, GET_BRAINTREE_CLIENT_TOKEN_SUCCESS, GET_BRAINTREE_CLIENT_TOKEN_FAIL],
    promise: client => client.get(`users/${jwtDecode(jwt).rid}/clientToken`, { auth: jwt }),
  }
}
