// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var ManageHomeContainer = require('./components/manage-home-container.react');
var i18n = require('../global/util/i18n');


if ($('#manage-home-container').length) {
  i18n.loadNamespaces(['languages','manage_home', 'immersions', 'homes', 'rooms', 'common'],function(){
    // Manage home parent
    ReactDOM.render(
      <ManageHomeContainer />, document.querySelector('#manage-home-container')
    )
  });
}
