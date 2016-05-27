const jwt_decode = require('jwt-decode')
const verificationsModuleInit = require('verifications-module-init')

module.exports = function() {

  // Don't allow logged in users to access the login page
  if (window.location.href.indexOf("login") > -1) {
    window.location = '/'
  }

  // Get JWT
  var JWT = localStorage.getItem('JWT') ? jwt_decode(localStorage.getItem('JWT')) : null

  // Perform certain actions if the user isn't fully verified
  if (JWT.cbk > 0) {
    verificationsModuleInit('/manage-home')
  } else if (JWT.cbk === 0) {
    // Perform other actions if the user is fully verified
    $('li.get-verified').hide()
  }

  // Print username into navbar
  $('span#navbar-username').html(JWT.name)

  // Remove modals
  $('#choose-languages-modal, #login-modal, #sign-up-modal').remove()

  // If any modal is open, close it
  if ($('.modal').length) {
    $('.modal').not('#confirmation-email-sent').closeModal()
    $('.lean-overlay').remove()
  }

  // Swap UI
  $('.logged-out').hide()
  $('.logged-in').fadeIn()

  // Input links to profile page
  $('a.go-to-your-profile').attr('href','/users/'+JWT.rid)

  // If user has a home, modify UI
  if (JWT.whost) {
    $('.become-a-host').hide()
    $('.your-home').show()
  }

  // Get unread message count
  require('./get-unread-message-count')

  $('#preloader').hide()

}
