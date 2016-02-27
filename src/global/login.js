module.exports = function(email, password) {

  var jwt_decode = require('jwt-decode');
  var domains = require('domains');
  var loginRedirect = require('login-redirect');
  var loggedIn = require('logged-in')

  // If a JWT is in localStorage, delete it
  localStorage.getItem('JWT') !== null ? localStorage.removeItem('JWT') : null;

  $('#preloader').show();

  var loginObj = {}
  loginObj.email = email,
  loginObj.password = password,

  console.log(loginObj)

  $.ajax({
    type: "POST",
    url: domains.API + '/users/login',
    contentType: "application/json",
    data: JSON.stringify(loginObj),
    success: function(JWT) {

      localStorage.setItem('JWT', JWT.token);

      loginRedirect();

      loggedIn();

      $('#preloader').hide();

    },
    error: function() {

      $('#preloader').hide();
      alert('Login failed');

    }
  })

}
