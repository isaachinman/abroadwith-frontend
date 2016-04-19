const React = require('react');

const domains = require('domains');
const JWT = require('JWT');
const GET = require('GET');

const i18n = require('i18n');

const currencies = require('currencies');

// Component export
module.exports = React.createClass({
  componentDidMount: function() {

    var bookingId = $('h1').attr('data-id');

    var url = domains.API+'/users/'+JWT.rid+'/reservations/'+bookingId+'/receipt';
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
      $('#serviceAndVatFees').html((currency+(response.serviceAndVatFees).toFixed(2)));
      $('#total-charge').html(currency+((response.bookingCharges - response.serviceAndVatFees).toFixed(2)));
    };
    GET(url, success)

  },
  render: function() {
    return (
      <div></div>
    );
  }
});
