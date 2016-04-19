const React = require('react');
const TripsList = require('./trips-list.react')

const JWT = require('JWT');
const GET = require('GET');

const jwt_decode = require('jwt-decode');
const domains = require('domains');

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
