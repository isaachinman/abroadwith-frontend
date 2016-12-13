import jwtDecode from 'jwt-decode'
import superagent from 'superagent'
import config from 'config.js'

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
    case LOAD_USER_WITH_AUTH:
      return {
        ...state,
        loading: true,
      }
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
        error: action.error,
      }
    case UPDATE_USER:
      return {
        ...state,
        loading: true,
      }
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
      }
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

// export function update(userID, userObject, jwt) {
//
//   return async dispatch => {
//     try {
//
//       const request = superagent.post(`${config.apiHost}/users/${userID}`)
//
//       // Determine what sort of login to perform
//       if (email && password) {
//         request.send({
//           email,
//           password,
//         })
//       } else if (email && facebookToken) {
//         request.send({
//           email,
//           facebookToken,
//         })
//       } else if (email && googleToken) {
//         request.send({
//           email,
//           googleToken,
//         })
//       }
//
//       request.withCredentials()
//
//       request.end((err, { body } = {}) => {
//
//         if (err) {
//
//           dispatch({ type: UPDATE_USER_FAIL, err })
//
//         } else if (body && body.token) {
//
//           // Login was successful
//           const jwt = body.token
//           dispatch({ type: UPDATE_USER_SUCCESS, jwt })
//
//           // Now fetch full private info on user
//           dispatch(loadUserWithAuth(jwt))
//
//           // If user has a home, get that info too
//           if (jwtDecode(jwt).hid) {
//             dispatch(loadHomeWithAuth(jwt))
//           }
//         } else {
//
//           dispatch({ type: UPDATE_USER_FAIL, err: 'Unknown error' })
//
//         }
//
//       })
//
//     } catch (err) {
//       dispatch({ type: UPDATE_USER_FAIL, err })
//     }
//   }
// }

export function load(jwt, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {
    try {

      const request = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}`)

      request.set({ Authorization: `Bearer ${(jwt)}` })

      request.end((err, { body } = {}) => {

        if (err) {

          dispatch({ type: LOAD_USER_WITH_AUTH_SUCCESS, err })
          cb()

        } else if (body) {

          // Login was successful
          dispatch({ type: LOAD_USER_WITH_AUTH_SUCCESS, result: body })
          cb()

        } else {

          dispatch({ type: LOAD_USER_WITH_AUTH_FAIL, err: 'Unknown error' })
          cb()

        }

      })

    } catch (err) {
      dispatch({ type: LOAD_USER_WITH_AUTH_FAIL, err })
      cb()
    }
  }

  // return {
  //   types: [LOAD_USER_WITH_AUTH, LOAD_USER_WITH_AUTH_SUCCESS, LOAD_USER_WITH_AUTH_FAIL],
  //   promise: client => client.get(`users/${jwtDecode(jwt).rid}`, { auth: jwt })
  //     .then(() => {
  //       // dispatch({ type: LOAD_USER_WITH_AUTH_SUCCESS, data: response })
  //       callback()
  //     }
  //     ),
  // }
}

export function update(userID, userObject, jwt, dispatch) {

  const cleanedData = userObject
  delete cleanedData.paymentMethods
  delete cleanedData.payoutMethods
  delete cleanedData.verifications
  delete cleanedData.email

  return {
    types: [UPDATE_USER, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL],
    promise: client => client.post(`users/${userID}`, { data: cleanedData, auth: jwt })
      .then(() => dispatch(load(jwt))
      ),
  }

}
