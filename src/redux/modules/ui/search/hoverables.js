// --------------------------------------------------------------------------------
// While this is technically a UI reducer, it's at the top level for 2 reasons:
// 1) speed of duplication, 2) blacklist from redux-persist (localstorage)
// --------------------------------------------------------------------------------

// Result mouseEnter
const ROOM_RESULT_MOUSE_ENTER = 'abroadwith/ROOM_RESULT_MOUSE_ENTER'

// Result mouseOut
const ROOM_RESULT_MOUSE_LEAVE = 'abroadwith/ROOM_RESULT_MOUSE_LEAVE'

// Open map popover
const ROOM_POPOVER_OPEN = 'abroadwith/ROOM_POPOVER_OPEN'

// Close map popover
const ROOM_POPOVER_CLOSE = 'abroadwith/ROOM_POPOVER_CLOSE'

// Result mouseEnter
const COURSE_RESULT_MOUSE_ENTER = 'abroadwith/COURSE_RESULT_MOUSE_ENTER'

// Result mouseOut
const COURSE_RESULT_MOUSE_LEAVE = 'abroadwith/COURSE_RESULT_MOUSE_LEAVE'

// Open map popover
const COURSE_POPOVER_OPEN = 'abroadwith/COURSE_POPOVER_OPEN'

// Close map popover
const COURSE_POPOVER_CLOSE = 'abroadwith/COURSE_POPOVER_CLOSE'

const initialState = {
  roomHovered: null,
  roomPopover: null,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ROOM_POPOVER_OPEN: {
      return {
        ...state,
        roomPopover: action.roomID,
      }
    }
    case ROOM_POPOVER_CLOSE: {
      return {
        ...state,
        roomPopover: null,
      }
    }
    case ROOM_RESULT_MOUSE_ENTER:
      return {
        ...state,
        roomHovered: action.roomID,
      }
    case ROOM_RESULT_MOUSE_LEAVE:
      return {
        ...state,
        roomHovered: null,
      }
    case COURSE_POPOVER_OPEN: {
      return {
        ...state,
        coursePopover: action.courseID,
      }
    }
    case COURSE_POPOVER_CLOSE: {
      return {
        ...state,
        coursePopover: null,
      }
    }
    case COURSE_RESULT_MOUSE_ENTER:
      return {
        ...state,
        courseHovered: action.courseID,
      }
    case COURSE_RESULT_MOUSE_LEAVE:
      return {
        ...state,
        courseHovered: null,
      }
    default:
      return state
  }
}

export function roomResultMouseEnter(roomID) {
  return async dispatch => dispatch({ type: ROOM_RESULT_MOUSE_ENTER, roomID })
}

export function roomResultMouseLeave() {
  return async dispatch => dispatch({ type: ROOM_RESULT_MOUSE_LEAVE })
}

export function roomPopoverOpen(roomID) {
  return async dispatch => dispatch({ type: ROOM_POPOVER_OPEN, roomID })
}

export function roomPopoverClose() {
  return async dispatch => dispatch({ type: ROOM_POPOVER_CLOSE })
}

export function courseResultMouseEnter(courseID) {
  return async dispatch => dispatch({ type: COURSE_RESULT_MOUSE_ENTER, courseID })
}

export function courseResultMouseLeave() {
  return async dispatch => dispatch({ type: COURSE_RESULT_MOUSE_LEAVE })
}

export function coursePopoverOpen(courseID) {
  return async dispatch => dispatch({ type: COURSE_POPOVER_OPEN, courseID })
}

export function coursePopoverClose() {
  return async dispatch => dispatch({ type: COURSE_POPOVER_CLOSE })
}
