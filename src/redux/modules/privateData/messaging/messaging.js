import jwtDecode from 'jwt-decode'
import superagent from 'superagent'
import config from 'config'

// Get all messages (top level info)
const GET_ALL_MESSAGES = 'abroadwith/GET_ALL_MESSAGES'
const GET_ALL_MESSAGES_SUCCESS = 'abroadwith/GET_ALL_MESSAGES_SUCCESS'
const GET_ALL_MESSAGES_FAIL = 'abroadwith/GET_ALL_MESSAGES_FAIL'

// Load messages from thread
const LOAD_MESSAGE_THREAD = 'abroadwith/LOAD_MESSAGE_THREAD'
const LOAD_MESSAGE_THREAD_SUCCESS = 'abroadwith/LOAD_MESSAGE_THREAD_SUCCESS'
const LOAD_MESSAGE_THREAD_FAIL = 'abroadwith/LOAD_MESSAGE_THREAD_FAIL'

// Load messages from thread
const SEND_MESSAGE = 'abroadwith/SEND_MESSAGE'
const SEND_MESSAGE_SUCCESS = 'abroadwith/SEND_MESSAGE_SUCCESS'
const SEND_MESSAGE_FAIL = 'abroadwith/SEND_MESSAGE_FAIL'

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
        allThreads: action.result,
      }
    case GET_ALL_MESSAGES_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: true,
        errorMessage: action.error,
      }
    case LOAD_MESSAGE_THREAD: {
      console.log('state inside case: ', state)
      const existingData = state[`thread_${action.threadID}`] || {}
      existingData.loading = true
      existingData.loaded = false
      return {
        ...state,
        loading: true,
        [`thread_${action.threadID}`]: existingData,
      }
    }
    case LOAD_MESSAGE_THREAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        [`thread_${action.threadID}`]: {
          loading: false,
          loaded: true,
          data: action.result,
          lastTimestamp: action.lastTimestamp,
          endOfThread: action.endOfThread,
        },
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

export function sendMessage(jwt, threadID, message, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {
    try {

      dispatch({ type: SEND_MESSAGE })

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/messages/${threadID}`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send(message)

      request.end((err, res) => {

        if (err) {

          dispatch({ type: SEND_MESSAGE_FAIL, err })

        } else {

          // Request was successful
          dispatch({ type: SEND_MESSAGE_SUCCESS, threadID, result: res.body })
          cb()

        }

      })

    } catch (err) {
      dispatch({ type: SEND_MESSAGE_FAIL, err })
    }
  }
}

export function loadMessageThread(jwt, threadID, previousData, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {
    try {

      console.log('previousData: ', previousData)

      dispatch({ type: LOAD_MESSAGE_THREAD, threadID })

      const request = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}/messages/${threadID}?size=${previousData.data.length + 10}`)
      request.set({ Authorization: `Bearer ${(jwt)}` })

      request.end((err, res) => {

        if (err) {

          dispatch({ type: LOAD_MESSAGE_THREAD_FAIL, err })

        } else {

          // Request was successful
          const data = res.body
          const lastTimestamp = res.body[(res.body).length - 1].timestamp
          const endOfThread = lastTimestamp === previousData.lastTimestamp
          dispatch({
            type: LOAD_MESSAGE_THREAD_SUCCESS,
            threadID,
            result: data,
            lastTimestamp,
            endOfThread,
          })
          cb()

        }

      })

    } catch (err) {
      dispatch({ type: LOAD_MESSAGE_THREAD_FAIL, err })
    }
  }
}
