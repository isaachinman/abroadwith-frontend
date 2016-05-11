const domains = require('domains')
const GET = require('GET')
const POST = require('POST')

const jwt_decode = require('jwt-decode')

const loginRedirect = require('login-redirect');
const verificationsModuleInit = require('verifications-module-init')
const validateBookNowButtons = require('validate-book-now-buttons');
const validateMessageButtons = require('validate-message-buttons');

module.exports = function(loginObj, firstTime) {

  // If a JWT is in localStorage, delete it
  localStorage.getItem('JWT') !== null ? localStorage.removeItem('JWT') : null;

  $('#preloader').show()

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
      verificationsModuleInit()
      validateBookNowButtons()
      validateMessageButtons()

      $('#preloader').hide()

      // If a user came from signup, perform signup specific actions
      if (firstTime === true) {

        // Send user registration tracking event
        ga('send', 'event', 'user_events', 'registration')

        $('#sign-up-modal').closeModal()

        // Geocode
        var JWT = jwt_decode(localStorage.getItem('JWT'))
        $.get('https://api.teletext.io/api/v1/geo-ip', function(response){
          var url = domains.API + '/users/' + JWT.rid
          var success = function(user) {

            delete user.paymentMethods;
            delete user.payoutMethods;
            delete user.verifications;
            delete user.email;

            user.address = {}
            user.address.country = response.alpha2
            POST(url, user, null)
          }
          GET(url, success)
        })

        // Open email confirmation and verification modals
        $('#confirmation-email-sent').openModal({
          complete: function() {
            loginRedirect()
          }
        })

      } else {
        loginRedirect()
      }

    },
    error: function() {

      $('#preloader').hide();
      $('#login-modal .modal-failure').show();

    }
  })

}
