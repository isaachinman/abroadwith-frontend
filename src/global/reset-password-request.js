var domains = require('domains');


if ($('a.reset-password').length) {

  $('form.reset-password').submit(function() {

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
        $('form.reset-password').hide();
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

  $('a.reset-password').click(function() {

    $(this).parentsUntil('form').find('.submit').click();

  })

}
