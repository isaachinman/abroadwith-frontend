const logout = require('logout')
const jwt_decode = require('jwt-decode')


let expiry = localStorage.getItem('JWT') !== null ? new Date((jwt_decode(localStorage.getItem('JWT'))).exp * 1000) : null;
let today = new Date()

if (today >= expiry) {
  logout()
}

console.log(expiry)
module.exports = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;
