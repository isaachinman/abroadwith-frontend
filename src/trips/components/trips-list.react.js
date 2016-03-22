var React = require('react');
var TripPending = require('./trip--pending.react');
var TripApproved = require('./trip--approved.react');
var TripDeclined = require('./trip--declined.react');
var TripCancelled = require('./trip--cancelled.react');
var NoTrips = require('./no-trips.react')

module.exports = React.createClass({
  componentDidMount: function() {
    $('ul.trips').collapsible()
  },
  render: function() {

    if (typeof this.props.trips !== 'undefined') {

      var trips = this.props.trips;

      if (trips.length > 0) {

        // One array for each trip type
        var tripsDOM = [
          pendingTrips = [],
          approvedTrips = [],
          cancelledTrips = [],
          declinedTrips = []
        ];

        for (var i=0; i<trips.length; i++) {

          // Render trip component depending on status
          if (trips[i].status === 'PENDING') {
            pendingTrips.push(
              <TripPending
                trip={trips[i]}
                refreshState={this.props.refreshState}
              />
            )
          } else if (trips[i].status === 'APPROVED' || trips[i].status === 'PAID_OUT' || trips[i].status === 'ARCHIVED') {
            approvedTrips.push(
              <TripApproved
                trip={trips[i]}
                refreshState={this.props.refreshState}
              />
            )
          } else if (trips[i].status === 'CANCELLED_BY_GUEST' || trips[i].status === 'CANCELLED_BY_HOST') {
            cancelledTrips.push(
              <TripCancelled
                trip={trips[i]}
              />
            )
          } else if (trips[i].status === 'DECLINED_BY_GUEST' || trips[i].status === 'DECLINED_BY_HOST' || trips[i].status === 'DECLINED_AUTOMATICALLY') {
            declinedTrips.push(
              <TripDeclined
                trip={trips[i]}
              />
            )
          }
        }

        // Sort arrays by arrivalDate
        for (var i=0; i<tripsDOM.length; i++) {
          tripsDOM[i].sort(function(a,b) {
            return new Date(a.props.trip.arrivalDate).getTime() - new Date(b.props.trip.arrivalDate).getTime();
          })
        }

      } else {
        var tripsDOM = [];
        tripsDOM.push(
          <NoTrips />
        )
      }
    }

    return (
      <ul class="collapsible popout trips" data-collapsible="accordion">

        {tripsDOM}

      </ul>
    )
  }
})
