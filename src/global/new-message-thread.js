var domains = require('domains');

var toast = require('toast');

var i18n = require('./util/i18n');

var JWT = require('JWT');
var POST = require('POST');

module.exports = function() {

  i18n.loadNamespaces(['common'],function(){

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
      toast(i18n.t('common:message_sent_toast'));
    }
    POST(url, threadObj, success);

  })

}
