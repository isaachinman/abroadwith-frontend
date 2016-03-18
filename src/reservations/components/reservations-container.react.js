var React = require('react');
var ReservationsList = require('./reservations-list.react')

var GET = require('GET');
var JWT = require('JWT');

var jwt_decode = require('jwt-decode');
var domains = require('domains');

// Component export
module.exports = React.createClass({
  refreshState: function() {

    var url = domains.API+'/users/'+JWT.rid+'/reservations';
    var success = function(response) {
      console.log(response)
      this.setState({reservations:response})
    }.bind(this);
    GET(url, success)

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
