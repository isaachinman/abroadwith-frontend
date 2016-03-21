// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var TripsContainer = require('./components/trips-container.react');
var i18n = require('../global/util/i18n');

if ($('#trips-container').length) {
  i18n.loadNamespaces(['trips', 'common', 'countries', 'homes', 'languages'],function(){
    // Trips parent
    ReactDOM.render(
      <TripsContainer />, document.querySelector('#trips-container')
    )
  });
}
