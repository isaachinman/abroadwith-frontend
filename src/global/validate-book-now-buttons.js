const i18n = require('i18n');
const jwt_decode = require('jwt-decode');

module.exports = function() {
  if ($('a.btn-book').length) {

    $(function() {

      var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

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
          $('a.btn-book').addClass('disabled');
          i18n.loadNamespaces(['common'],function(){
            $('a.btn-book').after('<div class="small"><a href="/admin#verifications">'+i18n.t('common:click_to_validate_account')+'</a></div>')
          })


          if (JWT.cbk === 1) {

            // User is missing email verification
            $('a.btn-book').attr('data-tooltip', i18n.t('common:please_verify_email_to_book'));


          } else if (JWT.cbk === 2) {

            // User is missing phone verification
            $('a.btn-book').attr('data-tooltip', i18n.t('common:please_verify_phone_to_book'));

          } else if (JWT.cbk === 3) {

            // User is missing both email and phone verification
            $('a.btn-book').attr('data-tooltip', i18n.t('common:please_verify_email_and_phone_to_book'));

          }
        }

        $('a.btn-book').tooltip();

      }
    })

  }
}
