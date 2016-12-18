import jwtDecode from 'jwt-decode'
import superagent from 'superagent'
import config from 'config.js'

// Get Braintree clientToken
const SEND_PAYMENT_NONCE = 'abroadwith/SEND_PAYMENT_NONCE'
const SEND_PAYMENT_NONCE_SUCCESS = 'abroadwith/SEND_PAYMENT_NONCE_SUCCESS'
const SEND_PAYMENT_NONCE_FAIL = 'abroadwith/SEND_PAYMENT_NONCE_FAIL'

export default function sendPaymentNonce(jwt, nonce, callback) {

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
