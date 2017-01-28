// Hide footer
const HIDE_FOOTER = 'abroadwith/HIDE_FOOTER'

// Show footer
const SHOW_FOOTER = 'abroadwith/SHOW_FOOTER'

const initialState = {
  hidden: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case HIDE_FOOTER:
      return {
        ...state,
        hidden: true,
      }
    case SHOW_FOOTER:
      return {
        ...state,
        hidden: false,
      }
    default:
      return state
  }
}

export function hideFooter() {
  return dispatch => dispatch({ type: HIDE_FOOTER })
}

export function showFooter() {
  return dispatch => dispatch({ type: SHOW_FOOTER })
}
