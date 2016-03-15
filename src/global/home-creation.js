var JWT = require('JWT');
var POST = require('POST');

var domains = require('domains');
var refreshToken = require('refresh-token');

if ($('a.become-a-host').length) {

  $('a.become-a-host').click(function() {

    $('#preloader').show();

    var url = domains.API+'/users/'+JWT.rid+'/homes';
    var data = {};
    var success = function() {
      refreshToken(function() {
        window.location = '/manage-home'
      })
    }
    POST(url, data, success);

  })

}
