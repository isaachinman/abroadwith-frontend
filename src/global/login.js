const domains = require('domains');

const loginRedirect = require('login-redirect');
const validateBookNowButtons = require('validate-book-now-buttons');
const validateMessageButtons = require('validate-message-buttons');

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

      // Set JWT
      localStorage.setItem('JWT', response.token);

      // Do UI stuff
      loginRedirect();
      validateBookNowButtons();
      validateMessageButtons();

      // If a user came from signup, show them the email confirmation modal
      if (firstTime === true) {
        $('#confirmation-email-sent').openModal({
          complete: function() {
            $('#verifications-modal').openModal()
          }
        })
      }

    },
    error: function() {

      $('#preloader').hide();
      $('#login-modal .modal-failure').show();

    }
  })

}
