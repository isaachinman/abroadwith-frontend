var JWT = require('JWT');

if ($('a.btn-book').length) {

  $(function() {
    if (JWT === null) {

      // User is not logged in
      $('a.btn-book').unbind('click')
      $('a.btn-book').addClass('modal-trigger');
      $('a.btn-book').addClass('tooltipped');
      $('a.btn-book').attr('data-position', 'bottom');
      $('a.btn-book').attr('data-delay', '0');
      $('a.btn-book').attr('href', '#login-modal');

    } else {

      if (JWT.cbk === 0) {

        // User can book, return out
        return

      } else {

        // User cannot book
        $('a.btn-book').off();
        $('a.btn-book').after('<div class="small"><a href="/admin#verifications">Click here to verify your account</a></div>')

        if (JWT.cbk === 1) {

          // User is missing email verification
          $('a.btn-book').attr('data-tooltip', 'Please verify your email to book');


        } else if (JWT.cbk === 2) {

          // User is missing phone verification
          $('a.btn-book').attr('data-tooltip', 'Please verify your phone to book');

        } else if (JWT.cbk === 3) {

          // User is missing both email and phone verification
          $('a.btn-book').attr('data-tooltip', 'Please verify your phone and email to book');

        }
      }

      $('a.btn-book').tooltip();

    }
  })

}
