var React = require('react');
var TripsList = require('./trips-list.react')

var JWT = require('JWT');
var GET = require('GET');

var jwt_decode = require('jwt-decode');
var domains = require('domains');

// Component export
module.exports = React.createClass({
  refreshState: function() {

    $('#preloader').show();

    var url = domains.API+'/users/'+JWT.rid+'/bookings';
    var success = function(response) {
      this.setState({trips:response});
      $('.collapsible-header.active').click();
      $('#preloader').hide();
    }.bind(this);
    GET(url, success)

  },
  getInitialState: function() {

    this.refreshState();

  },
  render: function() {
    return (
      <TripsList
        trips={this.state.trips}
        refreshState={this.refreshState}
      />
    );
  }
});
