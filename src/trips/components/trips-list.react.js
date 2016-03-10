var React = require('react');
var TripPending = require('./trip--pending.react');
var TripApproved = require('./trip--approved.react');
var TripDeclined = require('./trip--declined.react');
var TripCancelled = require('./trip--cancelled.react');

module.exports = React.createClass({
  render: function() {

    if (typeof this.props.trips !== 'undefined') {

      var trips = this.props.trips;
      var tripsDOM = [];

      for (var i=0; i<trips.length; i++) {

        // Render trip component depending on status
        if (trips[i].status === 'PENDING') {
          tripsDOM.push(
            <TripPending
              trip={trips[i]}
            />
          )
        } else if (trips[i].status === 'APPROVED') {
          tripsDOM.push(
            <TripApproved
              trip={trips[i]}
            />
          )
        } else if (trips[i].status === 'DECLINED') {
          tripsDOM.push(
            <TripDeclined
              trip={trips[i]}
            />
          )
        } else if (trips[i].status === 'CANCELLED') {
          tripsDOM.push(
            <TripCancelled
              trip={trips[i]}
            />
          )
        }

      }
    }

    return (
      <ul class="collapsible popout trips" data-collapsible="accordion">

        {tripsDOM}

      </ul>
    )
  }
})
