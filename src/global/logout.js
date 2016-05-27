module.exports = function() {

  // If a JWT is in localStorage, delete it
  localStorage.getItem('JWT') !== null ? localStorage.removeItem('JWT') : null

  // This POST needs to be custom, as the headers are different to all others
  $.ajax({
    type: "POST",
    url: '/logout',
    contentType: "application/json",
    xhrFields: { withCredentials: true },
    success: function(response) {
      location.reload()
    }
  })

}
