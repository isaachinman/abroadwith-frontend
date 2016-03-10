var React = require('react');
var ReservationPending = require('./reservation--pending.react');
var ReservationApproved = require('./reservation--approved.react');
var ReservationDeclined = require('./reservation--declined.react');
var ReservationCancelled = require('./reservation--cancelled.react');

module.exports = React.createClass({
  render: function() {

    if (typeof this.props.reservations !== 'undefined') {

      var reservations = this.props.reservations;
      var reservationsDOM = [];

      for (var i=0; i<reservations.length; i++) {

        // Render trip component depending on status
        if (reservations[i].status === 'PENDING') {
          reservationsDOM.push(
            <ReservationPending
              reservation={reservations[i]}
            />
          )
        } else if (reservations[i].status === 'APPROVED') {
          reservationsDOM.push(
            <ReservationApproved
              reservation={reservations[i]}
            />
          )
        } else if (reservations[i].status === 'DECLINED') {
          reservationsDOM.push(
            <ReservationDeclined
              reservation={reservations[i]}
            />
          )
        } else if (reservations[i].status === 'CANCELLED') {
          reservationsDOM.push(
            <ReservationCancelled
              reservation={reservations[i]}
            />
          )
        }

      }
    }

    return (
      <ul class="collapsible popout trips" data-collapsible="accordion">

        {reservationsDOM}

      </ul>
    )
  }
})
