// Verify email modal
const OPEN_VERIFY_EMAIL_MODAL = 'abroadwith/OPEN_VERIFY_EMAIL_MODAL'
const CLOSE_VERIFY_EMAIL_MODAL = 'abroadwith/CLOSE_VERIFY_EMAIL_MODAL'

// Verify phone modal
const OPEN_VERIFY_PHONE_MODAL = 'abroadwith/OPEN_VERIFY_PHONE_MODAL'
const CLOSE_VERIFY_PHONE_MODAL = 'abroadwith/CLOSE_VERIFY_PHONE_MODAL'

const initialState = {
  verifyEmailModal: {
    open: false,
    reason: null,
    additionalData: {},
  },
  verifyPhoneModal: {
    open: false,
    reason: null,
    additionalData: {},
  },
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case OPEN_VERIFY_EMAIL_MODAL:
      return {
        ...state,
        verifyEmailModal: {
          open: true,
          reason: action.reason,
        },
      }
    case CLOSE_VERIFY_EMAIL_MODAL:
      return {
        ...state,
        verifyEmailModal: {
          open: false,
          reason: null,
        },
      }
    case OPEN_VERIFY_PHONE_MODAL:
      return {
        ...state,
        verifyPhoneModal: {
          open: true,
          reason: action.reason,
          additionalData: action.additionalData || {},
        },
      }
    case CLOSE_VERIFY_PHONE_MODAL:
      return {
        ...state,
        verifyPhoneModal: {
          open: false,
          reason: null,
        },
      }
    default:
      return state
  }
}

export function openVerifyEmailModal(reason) {
  return dispatch => dispatch({ type: OPEN_VERIFY_EMAIL_MODAL, reason })
}
export function closeVerifyEmailModal() {
  return dispatch => dispatch({ type: CLOSE_VERIFY_EMAIL_MODAL })
}
export function openVerifyPhoneModal(reason, additionalData) {
  return dispatch => dispatch({ type: OPEN_VERIFY_PHONE_MODAL, reason, additionalData })
}
export function closeVerifyPhoneModal() {
  return dispatch => dispatch({ type: CLOSE_VERIFY_PHONE_MODAL })
}
