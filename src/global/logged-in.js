module.exports = function() {

  var jwt_decode = require('jwt-decode');

  // Get JWT
  var JWT = localStorage.getItem('JWT') ? jwt_decode(localStorage.getItem('JWT')) : null;
  console.log(JWT);

  // Print username into navbar
  $('span#navbar-username').html(JWT.name)

  // Remove modals
  $('#choose-languages-modal').remove();
  $('#login-modal').remove();
  $('#sign-up-modal').remove();

  // If any modal is open, close it
  if ($('.modal')) {
    $('.modal').closeModal();
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
