const React = require('react');
const ReactDOM = require('react-dom');
const TripsContainer = require('./components/trips-container.react');
const i18n = require('i18n');

if ($('#trips-container').length) {
  i18n.loadNamespaces(['trips', 'common', 'countries', 'immersions', 'languages'],function(err,t){
    // Trips parent
    ReactDOM.render(
      <TripsContainer />, document.querySelector('#trips-container')
    )
  });
}
