const apiDate = require('api-date')

const i18n = require('i18n')
const jwt_decode = require('jwt-decode')

const verificationsModuleInit = require('verifications-module-init')
const goToBooking = require('go-to-booking')

module.exports = function() {
  if ($('a.btn-book').length) {

    $(function() {

      var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null

      if (JWT === null) {

        // User is not logged in
        $('a.btn-book').unbind('click')
        $('a.btn-book').addClass('modal-trigger')
        $('a.btn-book').addClass('tooltipped')
        $('a.btn-book').attr('data-position', 'bottom')
        $('a.btn-book').attr('data-delay', '0')
        $('a.btn-book').attr('href', '#login-modal')

      } else {

        if (JWT.cbk === 0) {

          // User can book
          $('a.btn-book').click(function() {
            goToBooking(parseInt($(this).attr('data-stay-id')), parseInt($(this).attr('data-rid')), $(this).attr('data-hid'))
          })


        } else {

          // User cannot book
          verificationsModuleInit('booking')
          $('a.btn-book').off()
          $('a.btn-book').click(function() {
            $('#verifications-modal').openModal()
          })

        }
      }
    })
  }
}
