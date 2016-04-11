var domains = require('domains');

var loginRedirect = require('login-redirect');

module.exports = function(loginObj, firstTime) {

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
      firstTime === true ? $('#confirmation-email-sent').openModal() : null;

    },
    error: function() {

      $('#preloader').hide();
      $('#login-modal .modal-failure').show();

    }
  })

}
