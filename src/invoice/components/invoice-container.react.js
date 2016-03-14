var React = require('react');

var jwt_decode = require('jwt-decode');
var domains = require('domains');

<<<<<<< HEAD
var currencies = require('currencies');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['countries']);

=======
>>>>>>> origin/development-unstable
// Component export
module.exports = React.createClass({
  componentDidMount: function() {

    var invoiceId = $('h1').attr('data-id');
<<<<<<< HEAD
    console.log(invoiceId);
=======
    console.log(invoiceId)
>>>>>>> origin/development-unstable

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
<<<<<<< HEAD
      url: domains.API+'/users/'+JWT.rid+'/invoices/'+invoiceId,
      type: "GET",
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        console.log(response)

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
=======
      url: domains.API+'/users/'+JWT.rid+'/bookings/49/invoice',
      type: "GET",
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(trips) {

        console.log(trips)

        var newState = {
          trips: trips,
        }

        if (this.isMounted()) {
          this.setState(newState);
        }
>>>>>>> origin/development-unstable

      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })

  },
  render: function() {
    return (
      <div></div>
    );
  }
});
