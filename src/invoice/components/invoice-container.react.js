const React = require('react');

const JWT = require('JWT');
const GET = require('GET');

const domains = require('domains');

const currencies = require('currencies');

const i18n = require('i18n');

// Component export
module.exports = React.createClass({
  componentDidMount: function() {

    var invoiceId = $('h1').attr('data-id');

    var url = domains.API+'/users/'+JWT.rid+'/invoices/'+invoiceId;
    var success = function(response) {

      var currency = currencies[response.currency]

      if (response.baseFees === null && response.totalServiceFee < 0) {

        // This is a refund invoice
        $('#base-fees-row').remove();
        $('#vat-fees-row').remove();
        $('#total-amount').html(i18n.t('receipts_invoices:amount_refunded'));
        $('#bookingCode').html(response.bookingCode);
        $('#serviceRenderedAt').html(response.serviceRenderedAt);
        $('#billingAddress').html(response.billingAddress);
        $('#fullName').html(response.fullName);
        $('#vatCountry').html(i18n.t('countries:'+response.vatCountry));
        $('#vatRate').html(response.vatRate);
        $('#totalServiceFee').html(currency+Math.abs(response.totalServiceFee));

      } else {

        // This is a normal invoice
        $('#bookingCode').html(response.bookingCode);
        $('#serviceRenderedAt').html(response.serviceRenderedAt);
        $('#billingAddress').html(response.billingAddress);
        $('#fullName').html(response.fullName);
        $('#vatCountry').html(i18n.t('countries:'+response.vatCountry));
        $('#vatRate').html(response.vatRate);
        $('#baseFees').html(currency+response.baseFees);
        $('#vatAmount').html(currency+response.vatAmount);
        $('#totalServiceFee').html(currency+response.totalServiceFee);

      }

    };
    GET(url, success)

  },
  render: function() {
    return (
      <div></div>
    );
  }
});
