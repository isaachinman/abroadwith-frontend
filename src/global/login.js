module.exports = function(email, password) {

  var jwt_decode = require('jwt-decode');

  // If a JWT is in localStorage, delete it
  localStorage.getItem('JWT') !== null ? localStorage.removeItem('JWT') : null;

  $('#preloader').show();

  var loginObj = {}
  loginObj.email = email,
  loginObj.password = password,

  console.log(loginObj)

  $.ajax({
    type: "POST",
    url: 'https://admin.abroadwith.com/users/login',
    contentType: "application/json",
    data: JSON.stringify(loginObj),
    success: function(JWT) {

      console.log(JWT);

      localStorage.setItem('JWT', JWT.token)

      $('#preloader').hide();

      // Get JWT
      var JWT = jwt_decode(localStorage.getItem('JWT'));
      console.log(JWT);

      // Print username into navbar
      $('span#navbar-username').html(JWT.name)

      // Toggle navbars
      $('#navbar').remove();
      $('#navbar-logged-in').show();
      $('#navbar-logged-in .right').fadeIn('fast');

      // If any modal is open, close it
      if ($('.modal')) {
        $('.modal').closeModal();
        $('.lean-overlay').remove()
      }

    },
    error: function() {

      $('#preloader').hide();
      alert('Login failed');

    }
  })

}
