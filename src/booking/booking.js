// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var Booking = require('./components/booking.react');
var i18n = require('../global/util/i18n');

if ($('#booking-container').length) {
  i18n.loadNamespaces(['homes', 'immersions', 'languages', 'countries'],function(){
    // Manage home parent
    ReactDOM.render(
      <Booking />, document.querySelector('#booking-container')
    )
  });
}
