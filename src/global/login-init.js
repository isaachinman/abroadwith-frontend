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
  var email = $(this).find('.login-email').val()
  var password = $(this).find('.login-password').val()
  login(email, password);
  return false;
})

$('#login-modal-btn').length ? $('#login-modal-btn').click(function() {
  console.log('trigger')
  console.log(($(this).parentsUntil('.email-login')))
  $('.email-login').submit();
}) : null;

// Facebook login


$('.fb-login').click(function() {

  FB.login(function(response) {
    if (response.status === 'connected') {

      $('#preloader').show();

      console.log(response.authResponse);

      var loginObj = {};
      loginObj.facebookToken = response.authResponse.accessToken;

      FB.api('/me', {
        fields: 'email'
      }, function(response) {

        loginObj.email = response.email;

        var url = domains.API + '/users/login';
        var success = function(response) {
          localStorage.setItem('JWT', response.token);
          loginRedirect();
          loggedIn();
        }
        POST(url, loginObj, success);

      })
    } else if (response.status === 'not_authorized') {
      // Not authorised
    } else {
      // Not logged into Facebook
    }
  }, {
    scope: 'email'
  })

})
