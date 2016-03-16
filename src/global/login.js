var domains = require('domains');

var loginRedirect = require('login-redirect');
var loggedIn = require('logged-in')

module.exports = function(email, password) {

  // If a JWT is in localStorage, delete it
  localStorage.getItem('JWT') !== null ? localStorage.removeItem('JWT') : null;

  $('#preloader').show();

  var loginObj = {
    email: email,
    password: password
  }

  console.log(loginObj)

  $.ajax({
    type: "POST",
    url: domains.API + '/users/login',
    contentType: "application/json",
    data: JSON.stringify(loginObj),
    success: function(response) {

      localStorage.setItem('JWT', response.token);
      location.reload();

    },
    error: function() {

      alert('Login failed')

    }
  })

}
