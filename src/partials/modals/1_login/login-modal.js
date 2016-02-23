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

      $.ajax({
          type: "POST",
          url: '/users/login',
          dataType: 'JSON',
          data: JSON.stringify(loginObj),
          success: function (JWT) {

            localStorage.setItem('JWT', JWT.token)

            $('#preloader').addClass('hide');
            var retrievedJWT = localStorage.getItem('JWT')
            console.log(retrievedJWT);

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
