import jwtDecode from 'jwt-decode'

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
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_VERIFICATION_SMS:
      return {
        ...state,
        loading: true,
      }
    case REQUEST_VERIFICATION_SMS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        phoneSecret: action.result,
      }
    case REQUEST_VERIFICATION_SMS_FAIL:
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

export function requestVerificationEmail(jwt) {
  return {
    types: [REQUEST_VERIFICATION_EMAIL, REQUEST_VERIFICATION_EMAIL_SUCCESS, REQUEST_VERIFICATION_EMAIL_FAIL],
    promise: client => client.get(`users/${jwtDecode(jwt).rid}/verification/email`, { auth: jwt }),
  }
}

export function requestVerificationSMS(jwt) {
  return {
    types: [REQUEST_VERIFICATION_SMS, REQUEST_VERIFICATION_SMS_SUCCESS, REQUEST_VERIFICATION_SMS_FAIL],
    promise: client => client.get(`users/${jwtDecode(jwt).rid}/verification/phone`, { auth: jwt }),
  }
}

export function verifyPhone(jwt, verifyPhoneObject) {
  return {
    types: [VERIFY_PHONE, VERIFY_PHONE_SUCCESS, VERIFY_PHONE_FAIL],
    promise: client => client.post(`users/${jwtDecode(jwt).rid}/verification/phone`, { data: verifyPhoneObject, auth: jwt }),
  }
}
