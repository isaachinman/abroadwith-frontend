// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var UserEditProfile = require('./components/user-edit-profile.react');

if ($('#user-edit-profile').length) {
  // Search parent
  ReactDOM.render(
    <UserEditProfile />, document.querySelector('#user-edit-profile')
  )
}
