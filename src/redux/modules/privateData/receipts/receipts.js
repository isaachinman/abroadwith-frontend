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
      console.log('load receipt was successful')
      return {
        ...state,
        [action.result.booking.id]: Object.assign({}, action.result, {
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

export function loadReceipt(jwt, bookingID) {
  return async dispatch => {
    try {

      dispatch({ type: LOAD_RECEIPT, bookingID })

      return new Promise((resolve) => {
        const request = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}/bookings/${bookingID}/receipt`)
        request.set({ Authorization: `Bearer ${(jwt)}` })

        request.end((err, { body } = {}) => {

          if (err) {

            dispatch({ type: LOAD_RECEIPT_FAIL, err, bookingID })

          } else if (body) {

            // Login was successful
            const secondRequest = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}/bookings/${bookingID}`)
            secondRequest.set({ Authorization: `Bearer ${(jwt)}` })
            secondRequest.end((secondErr, secondBody) => {
              if (err) {
                resolve(dispatch({ type: LOAD_RECEIPT_FAIL, secondErr, bookingID }))
              } else {
                resolve(dispatch({
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
