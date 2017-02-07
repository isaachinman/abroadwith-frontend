// Login modal
const OPEN_LOGIN_MODAL = 'abroadwith/OPEN_LOGIN_MODAL'
const CLOSE_LOGIN_MODAL = 'abroadwith/CLOSE_LOGIN_MODAL'

// Student signup modal
const OPEN_STUDENT_SIGNUP_MODAL = 'abroadwith/OPEN_STUDENT_SIGNUP_MODAL'
const CLOSE_STUDENT_SIGNUP_MODAL = 'abroadwith/CLOSE_STUDENT_SIGNUP_MODAL'

// Host signup modal
const OPEN_HOST_SIGNUP_MODAL = 'abroadwith/OPEN_HOST_SIGNUP_MODAL'
const CLOSE_HOST_SIGNUP_MODAL = 'abroadwith/CLOSE_HOST_SIGNUP_MODAL'

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
  loginModal: {
    open: false,
  },
  studentSignupModal: {
    open: false,
  },
  hostSignupModal: {
    open: false,
  },
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case OPEN_LOGIN_MODAL:
      return {
        ...state,
        loginModal: {
          open: true,
        },
      }
    case CLOSE_LOGIN_MODAL:
      return {
        ...state,
        loginModal: {
          open: false,
        },
      }
    case OPEN_STUDENT_SIGNUP_MODAL:
      return {
        ...state,
        studentSignupModal: {
          open: true,
        },
      }
    case CLOSE_STUDENT_SIGNUP_MODAL:
      return {
        ...state,
        studentSignupModal: {
          open: false,
        },
      }
    case OPEN_HOST_SIGNUP_MODAL:
      return {
        ...state,
        hostSignupModal: {
          open: true,
        },
      }
    case CLOSE_HOST_SIGNUP_MODAL:
      return {
        ...state,
        hostSignupModal: {
          open: false,
        },
      }
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

// Verify email modal
export function openVerifyEmailModal(reason) {
  return dispatch => dispatch({ type: OPEN_VERIFY_EMAIL_MODAL, reason })
}
export function closeVerifyEmailModal() {
  return dispatch => dispatch({ type: CLOSE_VERIFY_EMAIL_MODAL })
}

// Verify phone modal
export function openVerifyPhoneModal(reason, additionalData) {
  return dispatch => dispatch({ type: OPEN_VERIFY_PHONE_MODAL, reason, additionalData })
}
export function closeVerifyPhoneModal() {
  return dispatch => dispatch({ type: CLOSE_VERIFY_PHONE_MODAL })
}

// Login modal
export function openLoginModal() {
  return dispatch => dispatch({ type: OPEN_LOGIN_MODAL })
}
export function closeLoginModal() {
  return dispatch => dispatch({ type: CLOSE_LOGIN_MODAL })
}

// Student signup modal
export function openStudentSignupModal() {
  return dispatch => dispatch({ type: OPEN_STUDENT_SIGNUP_MODAL })
}
export function closeStudentSignupModal() {
  return dispatch => dispatch({ type: CLOSE_STUDENT_SIGNUP_MODAL })
}

// Host signup modal
export function openHostSignupModal() {
  return dispatch => dispatch({ type: OPEN_HOST_SIGNUP_MODAL })
}
export function closeHostSignupModal() {
  return dispatch => dispatch({ type: CLOSE_HOST_SIGNUP_MODAL })
}
