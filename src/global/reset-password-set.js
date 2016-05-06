const domains = require('domains');
const login = require('login');
const toast = require('toast')

if ($('a.reset-password').length) {

  $('form.reset-password').submit(function(e) {

    $('.validation-messages h5').hide();

    e.preventDefault();

    var firstPassword = $('input[name=first-password]').val()
    var secondPassword = $('input[name=second-password]').val()

    if (firstPassword === secondPassword) {

      if (firstPassword.length < 8 || !(firstPassword.match(/[a-z]/)) || !(firstPassword.match(/[A-Z]/) || /\d/.test(firstPassword))) {

        $('.password-not-valid').show();

      } else {

        $('#preloader').show();

        var passwordResetObj = {
          id: $('h1').attr('data-secret'),
          email: $('form.reset-password input[type=email]').val(),
          password: firstPassword
        }

        var loginObj = {
          email: $('form.reset-password input[type=email]').val(),
          password: firstPassword
        }

        $.ajax({
          type: "POST",
          url: domains.API + '/passwords/set',
          contentType: "application/json",
          data: JSON.stringify(passwordResetObj),
          success: function() {

            login(loginObj);

          },
          error: function() {

            $('#preloader').hide();
            toast('Something went wrong')

          }
        })

      }

    } else {
      $('.passwords-dont-match').show();
    }

    return false;

  })

  $('a.reset-password').click(function() {

    $('iframe').remove();

    $('form.reset-password').find('input[type=submit]').click();

  })


}
