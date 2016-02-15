// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var AdminEdit = require('./components/admin-edit.react');


if ($('#admin-edit').length) {
  // Search parent
  ReactDOM.render(
    <AdminEdit
      source='backend/user-edit/user-edit'
    />, document.querySelector('#admin-edit')
  )
}
