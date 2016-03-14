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

      if (reservations.length > 0) {

        // One array for each reservation type
        var reservationsDOM = [
          pendingReservations = [],
          approvedReservations = [],
          cancelledReservations = [],
          declinedReservations = []
        ];

        for (var i=0; i<reservations.length; i++) {

          // Render trip component depending on status
          if (reservations[i].status === 'PENDING') {
            pendingReservations.push(
              <ReservationPending
                reservation={reservations[i]}
                refreshState={this.props.refreshState}
              />
            )
          } else if (reservations[i].status === 'APPROVED' || reservations[i].status === 'PAID_OUT' || reservations[i].status === 'ARCHIVED') {
            approvedReservations.push(
              <ReservationApproved
                reservation={reservations[i]}
                refreshState={this.props.refreshState}
              />
            )
          } else if (reservations[i].status === 'CANCELLED_BY_GUEST' || reservations[i].status === 'CANCELLED_BY_HOST') {
            cancelledReservations.push(
              <ReservationCancelled
                reservation={reservations[i]}
              />
            )
          } else if (reservations[i].status === 'DECLINED_BY_GUEST' || reservations[i].status === 'DECLINED_BY_HOST' || reservations[i].status === 'DECLINED_AUTOMATICALLY') {
            declinedReservations.push(
              <ReservationDeclined
                reservation={reservations[i]}
              />
            )
          }
        }

        // Sort arrays by arrivalDate
        for (var i=0; i<reservationsDOM.length; i++) {
          reservationsDOM[i].sort(function(a,b) {
            return new Date(a.props.reservation.arrivalDate).getTime() - new Date(b.props.reservation.arrivalDate).getTime();
          })
        }

        console.log(pendingReservations)

      } else {
        reservationsDOM = [];
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
