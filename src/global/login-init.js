var domains = require('domains');
var POST = require('POST');

var login = require('login');
var loginRedirect = require('login-redirect');

var loggedIn = require('logged-in');

if (localStorage.getItem('JWT') !== null) {
  loggedIn();
} else {
  notLoggedIn();
}

function notLoggedIn() {

  // Show logged out navbar
  $('#navbar .right').fadeIn('fast');

}

$('form.email-login').submit(function() {
  $('#preloader').show();
  login({
    email: $(this).find('.login-email').val(),
    password: $(this).find('.login-password').val()
  });
  return false;
})

$('#login-modal-btn').length ? $('#login-modal-btn').click(function() {
  $('.email-login').submit();
}) : null;

// Facebook login


$('.fb-login').click(function() {

  FB.login(function(response) {
    if (response.status === 'connected') {

      $('#preloader').show();

      var facebookToken = response.authResponse.accessToken;

      FB.api('/me', {
        fields: 'email'
      }, function(response) {

        login({
          email: response.email,
          facebookToken: facebookToken
        })

      })
    }
  }, {
    scope: 'email'
  })

})

window.googleLoginCounter = 0;
window.googleLogin = function(googleUser) {

  if (++googleLoginCounter < 2) { return };

  login({
    email: googleUser.getBasicProfile().getEmail(),
    googleToken: googleUser.getAuthResponse().id_token
  })

}
