import jwtDecode from 'jwt-decode'

// Set payout method as default
const GET_UNREAD_MESSAGE_COUNT = 'abroadwith/GET_UNREAD_MESSAGE_COUNT'
const GET_UNREAD_MESSAGE_COUNT_SUCCESS = 'abroadwith/GET_UNREAD_MESSAGE_COUNT_SUCCESS'
const GET_UNREAD_MESSAGE_COUNT_FAIL = 'abroadwith/GET_UNREAD_MESSAGE_COUNT_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_UNREAD_MESSAGE_COUNT:
      return {
        ...state,
        loading: true,
      }
    case GET_UNREAD_MESSAGE_COUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        unreadCount: action.result,
      }
    case GET_UNREAD_MESSAGE_COUNT_FAIL:
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

export function getUnreadMessageCount(jwt) {
  return {
    types: [GET_UNREAD_MESSAGE_COUNT, GET_UNREAD_MESSAGE_COUNT_SUCCESS, GET_UNREAD_MESSAGE_COUNT_FAIL],
    promise: client => client.get(`users/${jwtDecode(jwt).rid}/messages/count`, { auth: jwt }),
  }
}
