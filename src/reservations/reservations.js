// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var ReservationsContainer = require('./components/reservations-container.react');
var i18n = require('../global/util/i18n');

if ($('#reservations-container').length) {
  i18n.loadNamespaces(['trips', 'common', 'countries'],function(){
    // Reservations parent
    ReactDOM.render(
      <ReservationsContainer />, document.querySelector('#reservations-container')
    )
  });
}
