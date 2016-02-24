module.exports = function(email, password) {

  var jwt_decode = require('jwt-decode');

  // If a JWT is in localStorage, delete it
  localStorage.getItem('JWT') !== null ? localStorage.removeItem('JWT') : null;

  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (re.test(email) === true) {

    $('#preloader').show();

    var loginObj = {
      email: email,
      password: password
    };

    console.log(loginObj)

    $.ajax({
      type: "POST",
      url: 'https://admin.abroadwith.com/users/login',
      contentType: "application/json",
      data: JSON.stringify(loginObj),
      success: function(JWT) {

        localStorage.setItem('JWT', JWT.token)

        $('#preloader').hide();

        // Get JWT
        var JWT = jwt_decode(localStorage.getItem('JWT'));
        console.log(JWT);

        // Print username into navbar
        $('span#navbar-username').html(JWT.name)

        // Toggle navbars
        $('#navbar').hide();
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
}
