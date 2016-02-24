// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var AdminEdit = require('./components/admin-edit.react');


if ($('#admin-edit').length) {
  // Admin parent
  ReactDOM.render(
    <AdminEdit />, document.querySelector('#admin-edit')
  )
}
