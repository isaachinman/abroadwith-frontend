var React = require('react');

var domains = require('domains');
var JWT = require('JWT');
var GET = require('GET');

var i18n = require('../../global/util/i18n');

var currencies = require('currencies');

// Component export
module.exports = React.createClass({
  componentDidMount: function() {

    var bookingId = $('h1').attr('data-id');

    var url = domains.API+'/users/'+JWT.rid+'/bookings/'+bookingId+'/receipt';
    var success = function(response) {

      console.log(response)

      var currency = currencies[response.currency]
      $('#bookingCode').html(response.bookingCode);
      $('#arrivalDate').html(response.arrivalDate);
      $('#departureDate').html(response.departureDate);
      $('#duration').html(Math.round(Math.abs(((new Date(response.arrivalDate).getTime()) - (new Date(response.departureDate).getTime()))/(24*60*60*1000))))
      $('#guestFullName').html(response.guestFullName);
      $('#hostFullName').html(response.hostFullName);
      $('#destination').html(response.destination);
      $('#destinationShort').html(response.destinationShort);
    };
    GET(url, success)

    var url = domains.API+'/users/'+JWT.rid+'/bookings/'+bookingId;
    var success = function(response) {

      console.log(response)

      var currency = currencies[response.chargesCurrency]

      $('#base-charges').html(currency+((response.baseCharges).toFixed(2)));

      if (response.hostId === JWT.rid) {
        // User is host
        $('h1').html(i18n.t('receipts_invoices:immersion_confirmation'));
        $('#serviceAndVatFees').html((currency+(response.baseCharges*.03).toFixed(2)));
        $('#total-charge').html(currency+((response.baseCharges*.97).toFixed(2)));
      } else {
        // User is guest
        $('h1').html(i18n.t('receipts_invoices:customer_receipt'));
        $('#serviceAndVatFees').html((currency+(response.totalCharges-response.baseCharges)).toFixed(2));
        $('#total-charge').html(currency+((response.totalCharges).toFixed(2)));
      }


      var paymentsSettled = [];
      if (response.transactions.length > 0) {
        for (var i=0; i<response.transactions.length; i++) {
          paymentsSettled.push('<td>'+currency+response.transactions[i].amount+'</td><td>'+i18n.t('receipts_invoices:payment_statuses.'+response.transactions[i].status)+' ('+response.transactions[i].date[0]+'-'+(('0'+response.transactions[i].date[1]).slice(-2))+'-'+response.transactions[i].date[2]+')</td>')
        }
      } else {
        paymentsSettled.push('<td>'+i18n.t('trips:not_applicable')+'</td><td></td>')
      }
      $('#payments-settled').html(paymentsSettled);

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
