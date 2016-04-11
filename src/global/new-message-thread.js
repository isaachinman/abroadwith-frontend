var domains = require('domains');

var toast = require('toast');

var JWT = require('JWT');
var POST = require('POST');

module.exports = function() {

  $('#preloader').show();

  var threadObj = {
    homeId: $('h1').attr('data-home-id'),
    arrival: $('#message-arrival').val(),
    departure: $('#message-departure').val(),
    message: $('#message-content').val()
  }

  var url = domains.API + '/users/' + JWT.rid + '/messages';
  var success = function(response) {
    $('#preloader').hide();
    $('#send-message-modal').closeModal();
    toast('Message sent', 4000);
  }
  POST(url, threadObj, success);

}
