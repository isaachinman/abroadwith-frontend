var domains = require('domains');

if ($('a.reset-password-request').length) {

  $('form.reset-password-request').submit(function() {

    $('#preloader').show();

    var passwordResetRequestObj = {
      email:$(this).find('input[type=email]').val()
    }

    $.ajax({
      type: "POST",
      url: domains.API + '/passwords/reset',
      contentType: "application/json",
      data: JSON.stringify(passwordResetRequestObj),
      success: function() {

        $('.reset-password-request-successful').show();
        $('form.reset-password-request').hide();
        $('#preloader').hide();

      },
      error: function() {

        $('.reset-password-request-successful').show();
        $('form.reset-password').hide();
        $('#preloader').hide();

      }
    })

    return

  })

  $('a.reset-password-request').click(function() {

    $(this).parentsUntil('form').find('.submit').click();

  })

}
