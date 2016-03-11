var React = require('react');
var ReservationsList = require('./reservations-list.react')

var jwt_decode = require('jwt-decode');
var domains = require('domains');

// Component export
module.exports = React.createClass({
  refreshState: function() {

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/reservations',
      type: "GET",
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(reservations) {

        console.log(reservations)

        var newState = {
          reservations: reservations,
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
  getInitialState: function() {

    this.refreshState();

  },
  render: function() {
    return (
      <ReservationsList
        reservations={this.state.reservations}
        refreshState={this.refreshState}
      />
    );
  }
});
