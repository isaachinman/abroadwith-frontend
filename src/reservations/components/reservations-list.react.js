var React = require('react');
var ReservationPending = require('./reservation--pending.react');
var ReservationApproved = require('./reservation--approved.react');
var ReservationDeclined = require('./reservation--declined.react');
var ReservationCancelled = require('./reservation--cancelled.react');
var NoReservations = require('./no-reservations.react');

module.exports = React.createClass({
  render: function() {

    if (typeof this.props.reservations !== 'undefined') {

      var reservations = this.props.reservations;
      var reservationsDOM = [];

      if (reservations.length > 0) {
        for (var i=0; i<reservations.length; i++) {

          // Render trip component depending on status
          if (reservations[i].status === 'PENDING') {
            reservationsDOM.push(
              <ReservationPending
                reservation={reservations[i]}
              />
            )
          } else if (reservations[i].status === 'APPROVED' || reservations[i].status === 'PAID_OUT' || reservations[i].status === 'ARCHIVED') {
            reservationsDOM.push(
              <ReservationApproved
                reservation={reservations[i]}
              />
            )
          } else if (reservations[i].status === 'DECLINED_BY_GUEST' || reservations[i].status === 'DECLINED_BY_HOST' || reservations[i].status === 'DECLINED_AUTOMATICALLY') {
            reservationsDOM.push(
              <ReservationDeclined
                reservation={reservations[i]}
              />
            )
          } else if (reservations[i].status === 'CANCELLED_BY_GUEST' || reservations[i].status === 'CANCELLED_BY_HOST') {
            reservationsDOM.push(
              <ReservationCancelled
                reservation={reservations[i]}
              />
            )
          }
        }
      } else {
        reservationsDOM.push(
          <NoReservations />
        )
      }
    }

    return (
      <ul class="collapsible popout trips" data-collapsible="accordion">

        {reservationsDOM}

      </ul>
    )
  }
})
