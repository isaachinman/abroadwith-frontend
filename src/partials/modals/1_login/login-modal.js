if ($('#login-modal-btn').length) {

function login() {

    var email = $('#login-modal-email').val();
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(email) === true) {

      $('#preloader').removeClass('hide');

      var password = $('#login-modal-password').val();

      var loginObj = {};
      loginObj.email = email;
      loginObj.password = password;

      console.log(loginObj)

      $.ajax({
          type: "POST",
          url: 'https://admin.abroadwith.com/users/login',
          contentType: "application/json",
          data: JSON.stringify(loginObj),
          timeout: 3000,
          success: function (JWT) {

            localStorage.setItem('JWT', JWT.token)

            $('#preloader').addClass('hide');
            var retrievedJWT = localStorage.getItem('JWT')
            console.log(retrievedJWT);

          },
          error: function() {

            $('#preloader').addClass('hide');
            alert('Login failed');

          }
      })

    }
  }

  $('form#email-login').submit(function() {
    login();
    return false;
  })

  $('#login-modal-btn').click(login)



}
