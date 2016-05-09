const React = require('react');
const ReactDOM = require('react-dom');
const Booking = require('./components/booking.react');
const i18n = require('../global/util/i18n');

if ($('#booking-container').length) {

  // Send payment start booking event
  ga('send', 'event', 'booking_events', 'payment_start')

  i18n.loadNamespaces(['homes', 'immersions', 'languages', 'countries', 'common', 'booking'],function(){
    // Manage home parent
    ReactDOM.render(
      <Booking />, document.querySelector('#booking-container')
    )
  });
}
