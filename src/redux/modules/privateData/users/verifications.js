import jwtDecode from 'jwt-decode'
import superagent from 'superagent'
import config from 'config.js'
import { load as loadUserWithAuth } from 'redux/modules/privateData/users/loadUserWithAuth'

// Set payout method as default
const REQUEST_VERIFICATION_EMAIL = 'abroadwith/REQUEST_VERIFICATION_EMAIL'
const REQUEST_VERIFICATION_EMAIL_SUCCESS = 'abroadwith/REQUEST_VERIFICATION_EMAIL_SUCCESS'
const REQUEST_VERIFICATION_EMAIL_FAIL = 'abroadwith/REQUEST_VERIFICATION_EMAIL_FAIL'

// Delete payment method
const REQUEST_VERIFICATION_SMS = 'abroadwith/REQUEST_VERIFICATION_SMS'
const REQUEST_VERIFICATION_SMS_SUCCESS = 'abroadwith/REQUEST_VERIFICATION_SMS_SUCCESS'
const REQUEST_VERIFICATION_SMS_FAIL = 'abroadwith/REQUEST_VERIFICATION_SMS_FAIL'

// Delete payout method
const VERIFY_PHONE = 'abroadwith/VERIFY_PHONE'
const VERIFY_PHONE_SUCCESS = 'abroadwith/VERIFY_PHONE_SUCCESS'
const VERIFY_PHONE_FAIL = 'abroadwith/VERIFY_PHONE_FAIL'

const initialState = {
  email: {
    loading: false,
    loaded: false,
  },
  phone: {
    loading: false,
    loaded: false,
    phoneSecret: null,
  },
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_VERIFICATION_EMAIL: {
      return {
        ...state,
        email: {
          loading: true,
          loaded: false,
        },
      }
    }
    case REQUEST_VERIFICATION_EMAIL_SUCCESS: {
      return {
        ...state,
        email: {
          loading: false,
          loaded: true,
        },
      }
    }
    case REQUEST_VERIFICATION_EMAIL_FAIL: {
      return {
        ...state,
        email: {
          loading: false,
          loaded: false,
          error: true,
          errorMessage: action.error,
        },
      }
    }
    case REQUEST_VERIFICATION_SMS:
      return {
        ...state,
        phone: {
          loading: true,
          loaded: false,
          phoneSecret: null,
        },
      }
    case REQUEST_VERIFICATION_SMS_SUCCESS:
      return {
        ...state,
        phone: {
          loading: false,
          loaded: true,
          phoneSecret: action.result,
        },
      }
    case REQUEST_VERIFICATION_SMS_FAIL:
      return {
        ...state,
        phone: {
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

export function requestVerificationEmail(jwt, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {

    dispatch({ type: REQUEST_VERIFICATION_EMAIL })

    try {

      const request = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}/verification/email`)

      request.set({ Authorization: `Bearer ${(jwt)}` })

      request.end((err, res) => {

        if (err) {

          dispatch({ type: REQUEST_VERIFICATION_EMAIL_FAIL, err })

        } else {

          // Request was successful
          dispatch({ type: REQUEST_VERIFICATION_EMAIL_SUCCESS, result: res.text })
          cb() // In this case, only trigger callback if update was successful

        }

      })

    } catch (err) {
      dispatch({ type: REQUEST_VERIFICATION_EMAIL_FAIL, err })
    }
  }
}

export function requestVerificationSMS(jwt, cb) {

  return async dispatch => {

    dispatch({ type: REQUEST_VERIFICATION_SMS })

    try {

      const request = superagent.get(`${config.apiHost}/users/${jwtDecode(jwt).rid}/verification/phone`)

      request.set({ Authorization: `Bearer ${(jwt)}` })

      request.end((err, res) => {

        if (err) {

          dispatch({ type: REQUEST_VERIFICATION_SMS_FAIL, err })

        } else {

          // Request was successful
          dispatch({ type: REQUEST_VERIFICATION_SMS_SUCCESS, result: res.text })
          cb() // In this case, only trigger callback if update was successful

        }

      })

    } catch (err) {
      dispatch({ type: REQUEST_VERIFICATION_SMS_FAIL, err })
    }
  }

}

export function verifyPhone(jwt, verifyPhoneObject, callback) {

  const cb = typeof callback === 'function' ? callback : () => {}

  return async dispatch => {
    try {

      dispatch({ type: VERIFY_PHONE })

      const request = superagent.post(`${config.apiHost}/users/${jwtDecode(jwt).rid}/verification/phone`)

      request.set({ Authorization: `Bearer ${(jwt)}` })
      request.send(verifyPhoneObject)

      request.end((err) => {

        if (err) {

          dispatch({ type: VERIFY_PHONE_FAIL, err })

        } else {

          // Verification was successful
          dispatch({ type: VERIFY_PHONE_SUCCESS })

          // Reload the user object
          dispatch(loadUserWithAuth(jwt))

          // Fire callback
          cb()

        }

      })

    } catch (err) {
      dispatch({ type: VERIFY_PHONE_FAIL, err })
    }
  }

}
