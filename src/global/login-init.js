var jwt_decode = require('jwt-decode');
var login = require('login');
var loginRedirect = require('login-redirect');

if (localStorage.getItem('JWT') !== null) {
  loggedIn();
} else {
  notLoggedIn();
}

function loggedIn() {

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

}

function notLoggedIn() {

  // Show logged out navbar
  $('#navbar .right').fadeIn('fast');

  // Init Google login
  var googleScript = document.createElement('script');
  googleScript.type = 'text/javascript';
  googleScript.src = 'https://apis.google.com/js/platform.js';
  $('body').append(googleScript);

}

$('form.email-login').submit(function() {
  $('#preloader').show();
  var email = $(this).find('.login-email').val()
  var password = $(this).find('.login-password').val()
  login(email, password);
  return false;
})

$('#login-modal-btn').length ? $('#login-modal-btn').click(login) : null;

// Facebook login


$('.fb-login').click(function() {

  FB.login(function(response) {
    if (response.status === 'connected') {

      console.log(response.authResponse);

      var loginObj = {};
      loginObj.facebookToken = response.authResponse.accessToken;

      FB.api('/me', {
        fields: 'email'
      }, function(response) {

        loginObj.email = response.email;

        $.ajax({
          type: "POST",
          url: 'https://admin.abroadwith.com/users/login',
          contentType: "application/json",
          data: JSON.stringify(loginObj),
          success: function(JWT) {

            console.log(JWT);
            localStorage.setItem('JWT', JWT.token);

            // Print username into navbar
            $('span#navbar-username').html((jwt_decode(localStorage.getItem('JWT'))).name)

            // Toggle navbars
            $('#navbar').hide();
            $('#navbar-logged-in').show();
            $('#navbar-logged-in .right').fadeIn('fast');

            // If any modal is open, close it
            if ($('.modal')) {
              $('.modal').closeModal();
              $('.lean-overlay').remove()
            }

            loginRedirect();

          }
        })

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
