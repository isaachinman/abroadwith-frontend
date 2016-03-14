module.exports = function() {

  // If a JWT is in localStorage, delete it
  localStorage.getItem('JWT') !== null ? localStorage.removeItem('JWT') : null;

  // Refresh page
  window.location = window.location + '?has_logged_out=1';

}
