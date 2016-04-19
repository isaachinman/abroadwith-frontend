const React = require('react');
const ReactDOM = require('react-dom');
const i18n = require('i18n');

const Inbox = require('./components/inbox.react');

if ($('#inbox-container').length) {
  i18n.loadNamespaces(['inbox','common'],function(){
    // Manage home parent
    ReactDOM.render(
      <Inbox />, document.querySelector('#inbox-container')
    )
  });
}
