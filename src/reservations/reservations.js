const React = require('react');
const ReactDOM = require('react-dom');
const ReservationsContainer = require('./components/reservations-container.react');
const i18n = require('i18n');

if ($('#reservations-container').length) {
  i18n.loadNamespaces(['trips', 'common', 'countries', 'homes', 'languages', 'immersions'],function(){
    // Reservations parent
    ReactDOM.render(
      <ReservationsContainer />, document.querySelector('#reservations-container')
    )
  });
}
