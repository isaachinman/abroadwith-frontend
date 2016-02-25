module.exports = function() {
  if(window.location.href.indexOf("login") > -1) {
    window.location = '/'
  }
}
