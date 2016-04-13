var jwt_decode = require('jwt-decode');
var verificationsModuleInit = require('verifications-module-init');

module.exports = function() {

  // Get JWT
  var JWT = localStorage.getItem('JWT') ? jwt_decode(localStorage.getItem('JWT')) : null;

  if (JWT.cbk > 0) {
    verificationsModuleInit();
  }

  // Print username into navbar
  $('span#navbar-username').html(JWT.name)

  // Remove modals
  $('#choose-languages-modal').remove();
  $('#login-modal').remove();
  $('#sign-up-modal').remove();

  // If any modal is open, close it
  if ($('.modal')) {
    $('.modal').not('#confirmation-email-sent').closeModal();
    $('.lean-overlay').remove()
  }

  // Swap UI
  $('.logged-out').hide();
  $('.logged-in').fadeIn();

  // If user has a home, modify UI
  if (JWT.hid) {
    $('.become-a-host').hide();
    $('.your-home').show();
  }

  // Get unread message count
  require('./get-unread-message-count');

  $('#preloader').hide();

}
