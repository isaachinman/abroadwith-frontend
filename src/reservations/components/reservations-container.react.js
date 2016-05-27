const React = require('react');
const ReservationsList = require('./reservations-list.react')

const domains = require('domains');
const GET = require('GET');
const JWT = require('JWT');

// Component export
module.exports = React.createClass({
  refreshState: function() {

    $('#preloader').show();

    var url = domains.API+'/users/'+JWT.rid+'/reservations';
    var success = function(response) {
      this.setState({reservations:response});
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
      <ReservationsList
        reservations={this.state.reservations}
        refreshState={this.refreshState}
      />
    );
  }
});
