var POST = require('POST');

module.exports = function() {

  // If a JWT is in localStorage, delete it
  localStorage.getItem('JWT') !== null ? localStorage.removeItem('JWT') : null;

  var url = '/logout';

  var success = function() {
    location.reload();
  }

  POST(url, {}, success)

}
