const domains = require('domains');
const POST = require('POST');

const Cookies = require('js-cookie')

const login = require('login');
const loginRedirect = require('login-redirect');

const loggedIn = require('logged-in');

console.log(Cookies.get('access_token')) 

if (localStorage.getItem('JWT') !== null) {
  loggedIn()
} else if (Cookies.get('access_token')) {
  console.log(Cookies.get('access_token'))
  localStorage.setItem('JWT', Cookies.get('access_token'))
  loggedIn()
} else {


  $('.logged-out').fadeIn();
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
