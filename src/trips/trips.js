// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var TripsContainer = require('./components/trips-container.react');

if ($('#trips-container').length) {
  // Trips parent
  ReactDOM.render(
    <TripsContainer />, document.querySelector('#trips-container')
  )
}
