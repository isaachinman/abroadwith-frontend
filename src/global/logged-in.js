module.exports = function() {

  var jwt_decode = require('jwt-decode');

  // Get JWT
  var JWT = jwt_decode(localStorage.getItem('JWT'));
  console.log(JWT);

  // Print username into navbar
  $('span#navbar-username').html(JWT.name)

  // Toggle navbars
  $('#navbar').remove();
  $('#choose-languages-modal').remove();
  $('#log-in-modal').remove();
  $('#sign-up-modal').remove();
  $('#navbar-logged-in').show();
  $('#navbar-logged-in .right').fadeIn('fast');

  // If any modal is open, close it
  if ($('.modal')) {
    $('.modal').closeModal();
    $('.lean-overlay').remove()
  }

  // If user has a home, modify UI
  if (JWT.hid) {
    $('#navbar-logged-in .become-a-host').hide();
    $('#navbar-logged-in .your-home').show();
  }

  $('#preloader').hide();

}
