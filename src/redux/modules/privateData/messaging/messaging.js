import jwtDecode from 'jwt-decode'
import moment from 'moment'
import superagent from 'superagent'
import config from 'config'

// Get all messages (top level info)
const GET_ALL_MESSAGES = 'abroadwith/GET_ALL_MESSAGES'
const GET_ALL_MESSAGES_SUCCESS = 'abroadwith/GET_ALL_MESSAGES_SUCCESS'
const GET_ALL_MESSAGES_FAIL = 'abroadwith/GET_ALL_MESSAGES_FAIL'

// Create new thread
const CREATE_NEW_THREAD_WITH_HOST = 'abroadwith/CREATE_NEW_THREAD_WITH_HOST'
const CREATE_NEW_THREAD_WITH_HOST_SUCCESS = 'abroadwith/CREATE_NEW_THREAD_WITH_HOST_SUCCESS'
const CREATE_NEW_THREAD_WITH_HOST_FAIL = 'abroadwith/CREATE_NEW_THREAD_WITH_HOST_FAIL'

// Load messages from thread
const LOAD_MESSAGE_THREAD = 'abroadwith/LOAD_MESSAGE_THREAD'
const LOAD_MESSAGE_THREAD_SUCCESS = 'abroadwith/LOAD_MESSAGE_THREAD_SUCCESS'
const LOAD_MESSAGE_THREAD_FAIL = 'abroadwith/LOAD_MESSAGE_THREAD_FAIL'

// Send message in thread
const SEND_MESSAGE = 'abroadwith/SEND_MESSAGE'
const SEND_MESSAGE_SUCCESS = 'abroadwith/SEND_MESSAGE_SUCCESS'
const SEND_MESSAGE_FAIL = 'abroadwith/SEND_MESSAGE_FAIL'

const initialState = {
  loaded: false,
  newThread: {
    loading: false,
    loaded: false,
  },
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
    case CREATE_NEW_THREAD_WITH_HOST:
      return {
        ...state,
        newThread: {
          loading: true,
          loaded: false,
        },
      }
    case CREATE_NEW_THREAD_WITH_HOST_SUCCESS:
      return {
        ...state,
        newThread: {
          loading: false,
          loaded: true,
        },
      }
    case CREATE_NEW_THREAD_WITH_HOST_FAIL:
      return {
        ...state,
        newThread: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      }
    case LOAD_MESSAGE_THREAD: {

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

export function createNewThreadWithHost(jwt, threadObj, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {

    dispatch({ type: CREATE_NEW_THREAD_WITH_HOST })

    try {

      // Validate request
      if (moment().isAfter(moment(threadObj.arrival)) || moment().isAfter(moment(threadObj.departure)) || !moment(threadObj.arrival).isValid() || !moment(threadObj.departure).isValid()) {
        throw new Error('Date range is invalid')
      }

      return new Promise((resolve) => {

        const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/messages`)
        request.set({ Authorization: `Bearer ${(jwt)}` })
        request.send(threadObj)

        request.end(err => {

          if (err) {

            resolve(dispatch({ type: CREATE_NEW_THREAD_WITH_HOST_FAIL, err }))

          } else {

            // Request was successful
            resolve(dispatch({ type: CREATE_NEW_THREAD_WITH_HOST_SUCCESS }))
            cb()

          }

        })

      })

    } catch (err) {
      dispatch({ type: CREATE_NEW_THREAD_WITH_HOST_FAIL, err })
    }
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

export function loadMessageThread(jwt, threadID, previousData, depthToAdd) {

  return async dispatch => {
    try {

      dispatch({ type: LOAD_MESSAGE_THREAD, threadID })

      const request = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}/messages/${threadID}?size=${previousData.data.length + depthToAdd}`)
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

        }

      })

    } catch (err) {
      dispatch({ type: LOAD_MESSAGE_THREAD_FAIL, err })
    }
  }
}
