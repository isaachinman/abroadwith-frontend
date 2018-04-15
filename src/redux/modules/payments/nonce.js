import jwtDecode from 'jwt-decode'
import superagent from 'superagent'
import config from 'config.js'

// Send payment nonce
const SEND_PAYMENT_NONCE = 'abroadwith/SEND_PAYMENT_NONCE'
const SEND_PAYMENT_NONCE_SUCCESS = 'abroadwith/SEND_PAYMENT_NONCE_SUCCESS'
const SEND_PAYMENT_NONCE_FAIL = 'abroadwith/SEND_PAYMENT_NONCE_FAIL'

const initialState = {
  loading: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SEND_PAYMENT_NONCE:
      return {
        ...state,
        loading: true,
      }
    case SEND_PAYMENT_NONCE_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case SEND_PAYMENT_NONCE_FAIL:
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}

export function sendPaymentNonce(jwt, nonce, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {
    try {

      dispatch({ type: SEND_PAYMENT_NONCE })

      const newPaymentMethod = {
        paymentMethodNonce: nonce,
        isDefault: false,
      }

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/paymentMethods`)
      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send(newPaymentMethod)

      request.end(err => {

        if (err) {

          dispatch({ type: SEND_PAYMENT_NONCE_FAIL, err })

        } else {

          // Request was successful
          dispatch({ type: SEND_PAYMENT_NONCE_SUCCESS })
          cb()

        }

      })

    } catch (err) {
      dispatch({ type: SEND_PAYMENT_NONCE_FAIL, err })
    }
  }

}
