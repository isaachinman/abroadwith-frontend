// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var ManageHomeContainer = require('./components/manage-home-container.react');


if ($('#manage-home-container').length) {
  // Search parent
  ReactDOM.render(
    <ManageHomeContainer
    source='/search'
    />, document.querySelector('#manage-home-container')
  )
}
