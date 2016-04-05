var React = require('react');
var ReservationsList = require('./reservations-list.react')

var domains = require('domains');
var GET = require('GET');
var JWT = require('JWT');

// Component export
module.exports = React.createClass({
  refreshState: function() {

    var url = domains.API+'/users/'+JWT.rid+'/reservations';
    var success = function(response) {
      this.setState({reservations:response});
      $('.collapsible-header.active').click();
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
