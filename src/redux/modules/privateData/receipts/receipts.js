import config from 'config'
import jwtDecode from 'jwt-decode'
import superagent from 'superagent'

// Get all messages (top level info)
const LOAD_RECEIPT = 'abroadwith/LOAD_RECEIPT'
const LOAD_RECEIPT_SUCCESS = 'abroadwith/LOAD_RECEIPT_SUCCESS'
const LOAD_RECEIPT_FAIL = 'abroadwith/LOAD_RECEIPT_FAIL'

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case LOAD_RECEIPT:
      return {
        ...state,
        [action.bookingID]: {
          loading: true,
        },
      }
    case LOAD_RECEIPT_SUCCESS:
      return {
        ...state,
        [action.bookingID]: Object.assign({}, action.result, {
          loading: false,
          loaded: true,
        }),
      }
    case LOAD_RECEIPT_FAIL:
      return {
        ...state,
        [action.bookingID]: {
          loading: false,
          loaded: false,
          error: true,
          errorMessage: action.error,
        },
      }
    default:
      return state
  }
}

// NB: Unfortunately, course booking IDs and homestay booking IDs are not globally unique
// so, on the FE, they are given a prefix of either 'c' or 'h' depending on which they are
export function loadHomestayReceipt(jwt, rawID) {

  const bookingID = `h${rawID}`

  return async dispatch => {
    try {

      dispatch({ type: LOAD_RECEIPT, bookingID })

      return new Promise((resolve) => {
        const request = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}/bookings/${rawID}/receipt`)
        request.set({ Authorization: `Bearer ${(jwt)}` })

        request.end((err, { body } = {}) => {

          if (err) {

            dispatch({ type: LOAD_RECEIPT_FAIL, err, bookingID })

          } else if (body) {

            // Request was successful
            const secondRequest = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}/bookings/${rawID}`)
            secondRequest.set({ Authorization: `Bearer ${(jwt)}` })
            secondRequest.end((secondErr, secondBody) => {
              if (err) {
                resolve(dispatch({ type: LOAD_RECEIPT_FAIL, secondErr, bookingID }))
              } else {
                resolve(dispatch({
                  bookingID,
                  type: LOAD_RECEIPT_SUCCESS,
                  result: {
                    receipt: body,
                    booking: secondBody.body,
                  },
                }))
              }
            })

          } else {

            resolve(dispatch({ type: LOAD_RECEIPT_FAIL, err: 'Unknown error', bookingID }))

          }

        })
      })

    } catch (err) {
      dispatch({ type: LOAD_RECEIPT_FAIL, err, bookingID })
    }
  }
}

// NB: Unfortunately, course booking IDs and homestay booking IDs are not globally unique
// so, on the FE, they are given a prefix of either 'c' or 'h' depending on which they are
export function loadCourseReceipt(jwt, rawID) {

  const bookingID = `c${rawID}`

  return async dispatch => {
    try {

      dispatch({ type: LOAD_RECEIPT, bookingID })

      return new Promise((resolve) => {
        const request = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}/courseBookings/${rawID}/receipt`)
        request.set({ Authorization: `Bearer ${(jwt)}` })

        request.end((err, { body } = {}) => {

          if (err) {

            dispatch({ type: LOAD_RECEIPT_FAIL, err, bookingID })

          } else if (body) {

            // Request was successful
            const secondRequest = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}/courseBookings/${rawID}`)
            secondRequest.set({ Authorization: `Bearer ${(jwt)}` })
            secondRequest.end((secondErr, secondBody) => {
              if (err) {
                resolve(dispatch({ type: LOAD_RECEIPT_FAIL, secondErr, bookingID }))
              } else {
                resolve(dispatch({
                  bookingID,
                  type: LOAD_RECEIPT_SUCCESS,
                  result: {
                    receipt: body,
                    booking: secondBody.body,
                  },
                }))
              }
            })

          } else {

            resolve(dispatch({ type: LOAD_RECEIPT_FAIL, err: 'Unknown error', bookingID }))

          }

        })
      })

    } catch (err) {
      dispatch({ type: LOAD_RECEIPT_FAIL, err, bookingID })
    }
  }
}
