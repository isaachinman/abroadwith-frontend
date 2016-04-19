const jwt_decode = require('jwt-decode')

if ($('a.edit-your-profile').length) {
  JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;
  if ($('a.edit-your-profile').attr('data-user-id') == JWT.rid) {
    // This is users own profile page
    $('a.edit-your-profile').show();
  }
}
