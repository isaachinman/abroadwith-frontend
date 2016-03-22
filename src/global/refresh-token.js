var domains = require('domains');

var loggedIn = require('logged-in');
var jwt_decode = require('jwt-decode')

module.exports = function(callback) {
  
  var refreshObj = {
    token: localStorage.getItem('JWT')
  }

  console.log(localStorage.getItem('JWT'))

  console.log(refreshObj)

  // This POST needs to be custom, as the headers are different to all others
  $.ajax({
    type: "POST",
    url: domains.API + '/users/login',
    contentType: "application/json",
    data: JSON.stringify(refreshObj),
    success: function(response) {

      // Delete old token
      localStorage.getItem('JWT') !== null ? localStorage.removeItem('JWT') : null;

      console.log(response)

      // Set new token
      // localStorage.setItem('JWT', response.token);
      //
      // console.log(jwt_decode(localStorage.getItem('JWT')))

      // Refresh state for login
      loggedIn();

      // Execute callback
      callback();

    },
    error: function() {

      alert('Something failed');

    }
  })

}
