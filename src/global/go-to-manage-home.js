const jwt_decode = require('jwt-decode')

if ($('a.your-home').length) {

  $('a.your-home').click(function() {

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    if (JWT.cbk !== 0) {

      // User needs verifications, open verifications modal
      $('#verifications-modal').openModal()

    } else {

      // User is verified, go to manage home
      window.location = '/manage-home'

    }

  })

}
