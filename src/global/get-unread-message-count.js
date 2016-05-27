const domains = require('domains')
const GET = require('GET')
const jwt_decode = require('jwt-decode')

var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null

console.log(JWT)

var url = domains.API + '/users/' + JWT.rid + '/messages/count'
var success = function(response) {

  if (response.count > 0 && $('#unread-messages').length) {
    $('#unread-messages').html(response.count)
  }

}
GET(url, success)
