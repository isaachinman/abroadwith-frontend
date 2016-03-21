var React = require('react');
var ReactDOM = require('react-dom');
var i18n = require('../global/util/i18n');

var Inbox = require('./components/inbox.react');

if ($('#inbox-container').length) {
  i18n.loadNamespaces(['inbox','common'],function(){
    // Manage home parent
    ReactDOM.render(
      <Inbox />, document.querySelector('#inbox-container')
    )
  });
}
