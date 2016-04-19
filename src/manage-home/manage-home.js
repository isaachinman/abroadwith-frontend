const React = require('react');
const ReactDOM = require('react-dom');
const ManageHomeContainer = require('./components/manage-home-container.react');
const i18n = require('i18n');


if ($('#manage-home-container').length) {
  i18n.loadNamespaces(['languages','manage_home', 'immersions', 'homes', 'rooms', 'common'],function(){
    // Manage home parent
    ReactDOM.render(
      <ManageHomeContainer />, document.querySelector('#manage-home-container')
    )
  });
}
