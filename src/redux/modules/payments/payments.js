import jwtDecode from 'jwt-decode'
import superagent from 'superagent'
import config from 'config'
import { load as loadUserWithAuth } from 'redux/modules/privateData/users/loadUserWithAuth'

// Set payout method as default
const SET_PAYOUT_METHOD_DEFAULT = 'abroadwith/SET_PAYOUT_METHOD_DEFAULT'
const SET_PAYOUT_METHOD_DEFAULT_SUCCESS = 'abroadwith/SET_PAYOUT_METHOD_DEFAULT_SUCCESS'
const SET_PAYOUT_METHOD_DEFAULT_FAIL = 'abroadwith/SET_PAYOUT_METHOD_DEFAULT_FAIL'

// Delete payment method
const DELETE_PAYMENT_METHOD = 'abroadwith/DELETE_PAYMENT_METHOD'
const DELETE_PAYMENT_METHOD_SUCCESS = 'abroadwith/DELETE_PAYMENT_METHOD_SUCCESS'
const DELETE_PAYMENT_METHOD_FAIL = 'abroadwith/DELETE_PAYMENT_METHOD_FAIL'

// Delete payout method
const DELETE_PAYOUT_METHOD = 'abroadwith/DELETE_PAYOUT_METHOD'
const DELETE_PAYOUT_METHOD_SUCCESS = 'abroadwith/DELETE_PAYOUT_METHOD_SUCCESS'
const DELETE_PAYOUT_METHOD_FAIL = 'abroadwith/DELETE_PAYOUT_METHOD_FAIL'

export function setPayoutMethodDefault(jwt, payoutMethodID) {
  return {
    types: [SET_PAYOUT_METHOD_DEFAULT, SET_PAYOUT_METHOD_DEFAULT_SUCCESS, SET_PAYOUT_METHOD_DEFAULT_FAIL],
    promise: client => client.post(`users/${jwtDecode(jwt).rid}/paymentMethods/${payoutMethodID}`, { data: {}, auth: jwt }),
  }
}

export function deletePaymentMethod(jwt, paymentMethodID) {

  return async dispatch => {
    try {

      dispatch({ type: DELETE_PAYMENT_METHOD })

      const request = superagent.delete(`${config.apiHost}/users/${jwtDecode(jwt).rid}/paymentMethods/${paymentMethodID}`)
      request.set({ Authorization: `Bearer ${(jwt)}` })

      request.end(err => {

        if (err) {

          dispatch({ type: DELETE_PAYMENT_METHOD_FAIL, err })

        } else {

          // Login was successful
          dispatch({ type: DELETE_PAYMENT_METHOD_SUCCESS })
          dispatch(loadUserWithAuth(jwt))  // In this case, only trigger callback if update was successful

        }

      })

    } catch (err) {
      dispatch({ type: DELETE_PAYMENT_METHOD_FAIL, err })
    }
  }
}

export function deletePayoutMethod(jwt, paymentMethodID) {
  return {
    types: [DELETE_PAYOUT_METHOD, DELETE_PAYOUT_METHOD_SUCCESS, DELETE_PAYOUT_METHOD_FAIL],
    promise: client => client.delete(`users/${jwtDecode(jwt).rid}/payoutMethods/${paymentMethodID}`, { auth: jwt }),
  }
}
