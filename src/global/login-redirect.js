const loggedIn = require('logged-in')

module.exports = function() {
  if (window.location.href.indexOf("login") > -1 || window.location.href.indexOf("signup") > -1 || window.location.href.indexOf("reset-password") > -1) {
    window.location = '/'
  } else {
    loggedIn();
  }
}
