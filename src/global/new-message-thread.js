const domains = require('domains');
const apiDate = require('api-date');

const toast = require('toast');

const i18n = require('i18n');

const JWT = require('JWT');
const POST = require('POST');

module.exports = function() {

  i18n.loadNamespaces(['common'],function(){

    $('#preloader').show();

    var threadObj = {
      homeId: $('h1').attr('data-home-id'),
      arrival: apiDate($('#message-arrival').val()),
      departure: apiDate($('#message-departure').val()),
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
