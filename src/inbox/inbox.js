var React = require('react');
var ReactDOM = require('react-dom');

var Inbox = require('./components/inbox.react');

if ($('#inbox-container').length) {
  // Manage home parent
  ReactDOM.render(
    <Inbox />, document.querySelector('#inbox-container')
  )
}
