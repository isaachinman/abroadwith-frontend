const domains = require('domains');

const loggedIn = require('logged-in');
const jwt_decode = require('jwt-decode')

module.exports = function(callback) {

  var refreshObj = {
    token: localStorage.getItem('JWT')
  }

  // This POST needs to be custom, as the headers are different to all others
  $.ajax({
    type: "POST",
    url: domains.API + '/users/login',
    contentType: "application/json",
    data: JSON.stringify(refreshObj),
    success: function(response) {

      // Delete old token
      localStorage.getItem('JWT') !== null ? localStorage.removeItem('JWT') : null;

      // Set new token
      localStorage.setItem('JWT', response.token);

      // Execute callback
      callback();

    },
    error: function() {

      alert('Something failed');

    }
  })

}
