const React = require('react');
const ReactDOM = require('react-dom');
const UserEditProfile = require('./components/user-edit-profile.react');

const domains = require('domains');
const i18n = require('i18n')

const toast = require('toast');

if ($('#user-edit-profile').length) {

  i18n.loadNamespaces(['users'],function(){
    ReactDOM.render(
      <UserEditProfile />, document.querySelector('#user-edit-profile')
    )
  })

}
