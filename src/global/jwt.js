const logout = require('logout')
const jwt_decode = require('jwt-decode')


var expiry = localStorage.getItem('JWT') !== null ? new Date((jwt_decode(localStorage.getItem('JWT'))).exp * 1000) : null
var today = new Date()

console.log(expiry)

if (expiry !== null && today >= expiry) {
  logout()
}

module.exports = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null
