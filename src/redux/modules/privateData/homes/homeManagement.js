import jwtDecode from 'jwt-decode'

// Create homestay
const CREATE_HOMESTAY = 'abroadwith/CREATE_HOMESTAY'
const CREATE_HOMESTAY_SUCCESS = 'abroadwith/CREATE_HOMESTAY_SUCCESS'
const CREATE_HOMESTAY_FAIL = 'abroadwith/CREATE_HOMESTAY_FAIL'

// Delete homestay
const DELETE_HOMESTAY = 'abroadwith/DELETE_HOMESTAY'
const DELETE_HOMESTAY_SUCCESS = 'abroadwith/DELETE_HOMESTAY_SUCCESS'
const DELETE_HOMESTAY_FAIL = 'abroadwith/DELETE_HOMESTAY_FAIL'

export function createHomestay(jwt) {
  return {
    types: [CREATE_HOMESTAY, CREATE_HOMESTAY_SUCCESS, CREATE_HOMESTAY_FAIL],
    promise: client => client.post(`/users/${jwtDecode(jwt).rid}/homes`, { auth: jwt }),
  }
}

export function deleteHomestay(jwt) {
  return {
    types: [DELETE_HOMESTAY, DELETE_HOMESTAY_SUCCESS, DELETE_HOMESTAY_FAIL],
    promise: client => client.get(`/users/${jwtDecode(jwt).rid}/homes/${jwtDecode(jwt).hid}`, { auth: jwt }),
  }
}
