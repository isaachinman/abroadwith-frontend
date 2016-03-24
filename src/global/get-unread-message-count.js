var domains = require('domains');
var JWT = require('JWT');
var GET = require('GET');

var url = domains.API + '/users/' + JWT.rid + '/messages/count';
var success = function(response) {

  if (response.count > 0) {
    $('#unread-messages').html(response.count);
  }

}
GET(url, success);
