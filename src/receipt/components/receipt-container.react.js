var React = require('react');

var jwt_decode = require('jwt-decode');
var domains = require('domains');

var currencies = require('currencies');

// Component export
module.exports = React.createClass({
  componentDidMount: function() {

    var bookingId = $('h1').attr('data-id');

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/bookings/'+bookingId+'/receipt',
      type: "GET",
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        console.log(response)
        var currency = currencies[response.currency]
        $('#bookingCode').html(response.bookingCode);
        $('#arrivalDate').html(response.arrivalDate);
        $('#departureDate').html(response.departureDate);
        $('#duration').html(Math.abs(new Date(response.arrivalDate).getTime() - new Date(response.departureDate).getTime()))
        $('#guestFullName').html(response.guestFullName);
        $('#hostFullName').html(response.hostFullName);
        $('#destination').html(response.destination);
        $('#destinationShort').html(response.destinationShort);
        $('#bookingCharges').html(currency+response.bookingCharges);
        $('#serviceAndVatFees').html(currency+response.serviceAndVatFees);
        $('#total-charge').html(currency+(response.bookingCharges+response.serviceAndVatFees));


      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })

    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/bookings/'+bookingId,
      type: "GET",
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {



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
