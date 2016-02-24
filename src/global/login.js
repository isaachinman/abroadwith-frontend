var jwt_decode = require('jwt-decode');

if (localStorage.getItem('JWT') !== null) {
  loggedIn();
} else {
  notLoggedIn();
}

function login() {

  // If a JWT is in localStorage, delete it
  localStorage.getItem('JWT') !== null ? localStorage.removeItem('JWT') : null;

  var email = $('#login-modal-email').val();
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (re.test(email) === true) {

    $('#preloader').removeClass('hide');

    var password = $('#login-modal-password').val();

    var loginObj = {};
    loginObj.email = email;
    loginObj.password = password;

    console.log(loginObj)

    $.ajax({
      type: "POST",
      url: 'https://admin.abroadwith.com/users/login',
      contentType: "application/json",
      data: JSON.stringify(loginObj),
      timeout: 3000,
      success: function(JWT) {

        localStorage.setItem('JWT', JWT.token)

        $('#preloader').addClass('hide');

        loggedIn();


      },
      error: function() {

        $('#preloader').addClass('hide');
        alert('Login failed');

      }
    })

  }
}

function loggedIn() {

  // Get JWT
  var JWT = jwt_decode(localStorage.getItem('JWT'));
  console.log(JWT);

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

function notLoggedIn() {

  // Show logged out navbar
  $('#navbar .right').fadeIn('fast');

}

$('form#email-login').submit(function() {
  login();
  return false;
})

$('#login-modal-btn').length ? $('#login-modal-btn').click(login) : null;
