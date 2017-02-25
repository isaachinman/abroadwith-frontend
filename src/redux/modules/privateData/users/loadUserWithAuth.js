import jwtDecode from 'jwt-decode'
import superagent from 'superagent'
import config from 'config'
// import { REHYDRATE } from 'redux-persist/constants'

// Load user
const LOAD_USER_WITH_AUTH = 'abroadwith/LOAD_USER_WITH_AUTH'
const LOAD_USER_WITH_AUTH_SUCCESS = 'abroadwith/LOAD_USER_WITH_AUTH_SUCCESS'
const LOAD_USER_WITH_AUTH_FAIL = 'abroadwith/LOAD_USER_WITH_AUTH_FAIL'

// Update user
const UPDATE_USER = 'abroadwith/UPDATE_USER'
const UPDATE_USER_SUCCESS = 'abroadwith/UPDATE_USER_SUCCESS'
const UPDATE_USER_FAIL = 'abroadwith/UPDATE_USER_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    // // This is a rehydration (from localstore) case
    // case REHYDRATE: {
    //   const incoming = action.payload.privateData ? action.payload.privateData.user : false
    //   if (incoming) return { ...state, ...incoming }
    //   return state
    // }
    case LOAD_USER_WITH_AUTH:
      return Object.assign({}, state, {
        loading: true,
        loaded: false,
      })
    case LOAD_USER_WITH_AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
      }
    case LOAD_USER_WITH_AUTH_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: true,
      }
    case UPDATE_USER:
      return Object.assign({}, state, {
        loading: true,
      })
    case UPDATE_USER_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: false,
      })
    case UPDATE_USER_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      }
    default:
      return state
  }
}

export function isLoaded(globalState, userID) {
  return globalState.publicData.users[userID]
}

export function load(jwt, callback, bodylessCallback) {

  const cb = typeof callback === 'function' ? callback : () => {}
  const bdCb = typeof bodylessCallback === 'function' ? bodylessCallback : () => {}

  return async dispatch => {

    dispatch({ type: LOAD_USER_WITH_AUTH })

    try {

      return new Promise((resolve) => {

        console.log('inside load user with auth')

        const request = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}`)
        request.set({ Authorization: `Bearer ${(jwt)}` })

        request.end((err, { body } = {}) => {

          if (err) {

            resolve(dispatch({ type: LOAD_USER_WITH_AUTH_FAIL, err }))

          } else if (body) {

          // Load was successful
            resolve(dispatch({ type: LOAD_USER_WITH_AUTH_SUCCESS, result: body }))
            cb(body)
            bdCb()

          } else {

            resolve(dispatch({ type: LOAD_USER_WITH_AUTH_FAIL, err: 'Unknown error' }))

          }

        })

      })

    } catch (err) {
      dispatch({ type: LOAD_USER_WITH_AUTH_FAIL, err })
    }
  }
}

export function update(userID, userObject, jwt, callback) {

  // Clean the data - API will reject (eg 400) the presence of some properties
  const cleanedData = Object.assign({}, userObject)
  delete cleanedData.paymentMethods
  delete cleanedData.payoutMethods
  delete cleanedData.verifications
  delete cleanedData.email
  delete cleanedData.homeIds

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {

    dispatch({ type: UPDATE_USER })

    try {

      const request = superagent.post(`${config.apiHost}/users/${userID}`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send(cleanedData)

      request.end(err => {

        if (err) {

          dispatch({ type: UPDATE_USER_FAIL, err })

        } else {

          // Login was successful
          dispatch({ type: UPDATE_USER_SUCCESS })
          dispatch(load(jwt, cb))  // In this case, only trigger callback if update was successful

        }

      })

    } catch (err) {
      dispatch({ type: UPDATE_USER_FAIL, err })
    }
  }

}
