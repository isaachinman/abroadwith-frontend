var domains = require('domains');

var loginRedirect = require('login-redirect');

module.exports = function(loginObj) {

  // If a JWT is in localStorage, delete it
  localStorage.getItem('JWT') !== null ? localStorage.removeItem('JWT') : null;

  $('#preloader').show();

  $.ajax({
    type: "POST",
    url: domains.API + '/users/login',
    contentType: "application/json",
    data: JSON.stringify(loginObj),
    xhrFields: {withCredentials: true},
    success: function(response) {

      localStorage.setItem('JWT', response.token);
      loginRedirect();

    },
    error: function() {

      $('#preloader').hide();
      alert('Login failed')

    }
  })

}
