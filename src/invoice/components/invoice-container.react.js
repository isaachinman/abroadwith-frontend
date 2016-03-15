var React = require('react');

var JWT = require('JWT');
var GET = require('GET');

var jwt_decode = require('jwt-decode');
var domains = require('domains');

var currencies = require('currencies');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['countries']);

// Component export
module.exports = React.createClass({
  componentDidMount: function() {

    var invoiceId = $('h1').attr('data-id');

    var url = domains.API+'/users/'+JWT.rid+'/invoices/'+invoiceId;
    var success = function(response) {

      var currency = currencies[response.currency]
      $('#bookingCode').html(response.bookingCode);
      $('#serviceRenderedAt').html(response.serviceRenderedAt);
      $('#billingAddress').html(response.billingAddress);
      $('#fullName').html(response.fullName);
      $('#vatCountry').html(i18n.t('countries:'+response.vatCountry));
      $('#vatRate').html(response.vatRate);
      $('#baseFees').html(currency+response.baseFees);
      $('#vatAmount').html(currency+response.vatAmount);
      $('#totalServiceFee').html(currency+response.totalServiceFee);

    };
    GET(url, success)

  },
  render: function() {
    return (
      <div></div>
    );
  }
});
