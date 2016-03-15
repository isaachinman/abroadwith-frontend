var React = require('react');

var JWT = require('JWT');
var GET = require('GET');

var jwt_decode = require('jwt-decode');
var domains = require('domains');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['immersions', 'trips', 'languages']);

var currencies = require('currencies');

// Component export
module.exports = React.createClass({
  componentDidMount: function() {

    var bookingId = $('h1').attr('data-id');

    var url = domains.API+'/users/'+JWT.rid+'/bookings/'+bookingId+'/receipt';
    var success = function(response) {

      var currency = currencies[response.currency]
      $('#bookingCode').html(response.bookingCode);
      $('#arrivalDate').html(response.arrivalDate);
      $('#departureDate').html(response.departureDate);
      $('#duration').html(Math.round(Math.abs(((new Date(response.arrivalDate).getTime()) - (new Date(response.departureDate).getTime()))/(24*60*60*1000))))
      $('#guestFullName').html(response.guestFullName);
      $('#hostFullName').html(response.hostFullName);
      $('#destination').html(response.destination);
      $('#destinationShort').html(response.destinationShort);
      $('#bookingCharges').html(currency+response.bookingCharges);
      $('#serviceAndVatFees').html(currency+response.serviceAndVatFees);
      $('#total-charge').html(currency+(response.bookingCharges+response.serviceAndVatFees));

    };
    GET(url, success)

    var url = domains.API+'/users/'+JWT.rid+'/bookings/'+bookingId;
    var success = function(response) {

      $('#immersion-type').html(i18n.t('immersions:'+response.immersionType));
      $('#cancellation').html(i18n.t('trips:not_applicable'));
      $('#host-taught').html(i18n.t('languages:'+response.languageHostWillTeach));
      response.languageGuestWillTeach !== null ? $('#guest-taught').html(i18n.t('languages:'+response.languageGuestWillTeach)) : $('#guest-taught').html(i18n.t('trips:not_applicable'));

    };
    GET(url, success)

  },
  render: function() {
    return (
      <div></div>
    );
  }
});
