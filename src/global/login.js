const domains = require('domains')
const GET = require('GET')
const POST = require('POST')

const jwt_decode = require('jwt-decode')

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

      // If a user came from signup, show them the email confirmation modal and geocode their country
      if (firstTime === true) {

        var JWT = jwt_decode(localStorage.getItem('JWT'))
        $.getJSON('http://ipinfo.io', function(data){
          var url = domains.API + '/users/' + JWT.rid
          var success = function(user) {

            delete user.paymentMethods;
            delete user.payoutMethods;
            delete user.verifications;
            delete user.email;

            user.address = {}
            user.address.country = data.country
            POST(url, user, null)
          }
          GET(url, success)
        })

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
