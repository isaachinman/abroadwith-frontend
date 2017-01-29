// Result mouseEnter
const ROOM_RESULT_MOUSE_ENTER = 'abroadwith/ROOM_RESULT_MOUSE_ENTER'

// Result mouseOut
const ROOM_RESULT_MOUSE_LEAVE = 'abroadwith/ROOM_RESULT_MOUSE_LEAVE'

const initialState = {
  roomHovered: null,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
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
    default:
      return state
  }
}

export function roomResultMouseEnter(roomID) {
  return async dispatch => dispatch({ type: ROOM_RESULT_MOUSE_ENTER, roomID })
}

export function roomResultMouseLeave(roomID) {
  return async dispatch => dispatch({ type: ROOM_RESULT_MOUSE_LEAVE, roomID })
}
