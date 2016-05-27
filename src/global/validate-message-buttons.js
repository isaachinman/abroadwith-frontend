const i18n = require('i18n')
const jwt_decode = require('jwt-decode')

module.exports = function() {

  if ($('a.btn-msg').length) {

    $(function() {

      JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null

      if (JWT === null) {

        // User is not logged in
        $('a.btn-msg').attr('href', '#login-modal')

      }
    })
  }
}
