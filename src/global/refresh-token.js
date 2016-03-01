module.exports = function(callback) {

  var domains = require('domains');
  var loggedIn = require('logged-in')

  var refreshObj = {
    token: localStorage.getItem('JWT')
  }

  $.ajax({
    type: "POST",
    url: domains.API + '/users/login',
    contentType: "application/json",
    data: JSON.stringify(refreshObj),
    processData: false,
    success: function(response){

      // Delete old token
      localStorage.getItem('JWT') !== null ? localStorage.removeItem('JWT') : null;

      // Set new token
      localStorage.setItem('JWT', response.token);

      // Refresh state for login
      loggedIn();

      // Execute callback
      callback();

    },
    error: function(response) {
      // Something went wrong
      console.log('something went wrong');

    }
  });

}
