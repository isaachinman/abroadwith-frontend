var React = require('react');

var jwt_decode = require('jwt-decode');
var domains = require('domains');

// Component export
module.exports = React.createClass({
  componentDidMount: function() {

    var invoiceId = $('h1').attr('data-id');
    console.log(invoiceId)

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
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
