var domains = require('domains');
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

  console.log(threadObj)

  var url = domains.API + '/users/' + JWT.rid + '/messages';
  var success = function(response) {
    console.log(response)
    $('#preloader').hide();
    $('#send-message-modal').closeModal();
    Materialize.toast('Message sent', 4000);
  }
  POST(url, threadObj, success);

}
