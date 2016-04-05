var domains = require('domains');
var GET = require('GET');
var jwt_decode = require('jwt-decode');

var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

var url = domains.API + '/users/' + JWT.rid + '/messages/count';
var success = function(response) {

  if (response.count > 0) {
    $('#unread-messages').html(response.count);
  }

}
GET(url, success);
