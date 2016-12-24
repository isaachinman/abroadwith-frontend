import jwtDecode from 'jwt-decode'

// Get all messages (top level info)
const GET_ALL_MESSAGES = 'abroadwith/GET_ALL_MESSAGES'
const GET_ALL_MESSAGES_SUCCESS = 'abroadwith/GET_ALL_MESSAGES_SUCCESS'
const GET_ALL_MESSAGES_FAIL = 'abroadwith/GET_ALL_MESSAGES_FAIL'

// Load messages from thread
const LOAD_MESSAGE_THREAD = 'abroadwith/LOAD_MESSAGE_THREAD'
const LOAD_MESSAGE_THREAD_SUCCESS = 'abroadwith/LOAD_MESSAGE_THREAD_SUCCESS'
const LOAD_MESSAGE_THREAD_FAIL = 'abroadwith/LOAD_MESSAGE_THREAD_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_ALL_MESSAGES:
      return {
        ...state,
        loading: true,
      }
    case GET_ALL_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        messages: JSON.parse(action.result),
      }
    case GET_ALL_MESSAGES_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: true,
        errorMessage: action.error,
      }
    case LOAD_MESSAGE_THREAD:
      return {
        ...state,
        loading: true,
      }
    case LOAD_MESSAGE_THREAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        [`thread_${action.result.id}`]: JSON.parse(action.result),
      }
    case LOAD_MESSAGE_THREAD_FAIL:
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

export function loadMessages(jwt) {
  return {
    types: [GET_ALL_MESSAGES, GET_ALL_MESSAGES_SUCCESS, GET_ALL_MESSAGES_FAIL],
    promise: client => client.get(`users/${jwtDecode(jwt).rid}/messages`, { auth: jwt }),
  }
}

export function loadMessageThread(jwt, threadID, size, timestamp) {

  let url = `users/${jwtDecode(jwt).rid}/messages/${threadID}?size=${size}`
  if (timestamp) {
    url += `&timestamp=${timestamp}`
  }

  return {
    types: [LOAD_MESSAGE_THREAD, LOAD_MESSAGE_THREAD_SUCCESS, LOAD_MESSAGE_THREAD_FAIL],
    promise: client => client.get(url, { auth: jwt }),
  }

}
