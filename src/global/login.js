var domains = require('domains');
var POST = require('POST');

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

  var url = domains.API + '/users/login';
  var success = function(response) {

    localStorage.setItem('JWT', response.token);
    location.reload();

  }
  POST(url, loginObj, success);

}
