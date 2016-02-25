// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var ManageHomeContainer = require('./components/manage-home-container.react');


if ($('#manage-home-container').length) {
  // Manage home parent
  ReactDOM.render(
    <ManageHomeContainer />, document.querySelector('#manage-home-container')
  )
}
