// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var Booking = require('./components/booking.react');


if ($('#booking-container').length) {
  // Manage home parent
  ReactDOM.render(
    <Booking />, document.querySelector('#booking-container')
  )
}
