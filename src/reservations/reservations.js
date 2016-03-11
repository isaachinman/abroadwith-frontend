// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var ReservationsContainer = require('./components/reservations-container.react');

if ($('#reservations-container').length) {
  // Trips parent
  ReactDOM.render(
    <ReservationsContainer />, document.querySelector('#reservations-container')
  )
}
