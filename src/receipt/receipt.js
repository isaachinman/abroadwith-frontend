// Deps
var React = require('react');
var ReactDOM = require('react-dom');

if ($('#receipt-container').length) {
  // Trips parent
  ReactDOM.render(
    <ReceiptContainer />, document.querySelector('#receipt-container')
  )
}
