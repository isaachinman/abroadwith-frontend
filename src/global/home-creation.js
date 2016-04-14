var jwt_decode = require('jwt-decode');

var POST = require('POST');

var domains = require('domains');
var refreshToken = require('refresh-token');

if ($('a.become-a-host').length) {

  $('a.become-a-host').click(function() {

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    if (JWT.cbk !== 0) {

      // User needs verifications, open verifications modal
      $('#verifications-modal').openModal();

    } else {

      $('#preloader').show();

      var url = domains.API+'/users/'+JWT.rid+'/homes';
      var data = {};
      var success = function() {
        refreshToken(function() {
          window.location = '/manage-home'
        })
      }
      POST(url, data, success);

    }

  })

}
