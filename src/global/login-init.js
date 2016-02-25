var jwt_decode = require('jwt-decode');
var login = require('login')

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

}

$('form#email-login').submit(function() {
  $('#preloader').show();
  console.log('logged in logged in logged in logged in logged in');
  var email = $('#login-modal-email').val()
  var password = $('#login-modal-password').val()
  login(email, password);
  return false;
})

$('#login-modal-btn').length ? $('#login-modal-btn').click(login) : null;

// Facebook login


$('#fb-login').click(function() {

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
            $('span#navbar-username').html(JWT.name)

            // Toggle navbars
            $('#navbar').hide();
            $('#navbar-logged-in').show();
            $('#navbar-logged-in .right').fadeIn('fast');

            // If any modal is open, close it
            if ($('.modal')) {
              $('.modal').closeModal();
              $('.lean-overlay').remove()
            }

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
