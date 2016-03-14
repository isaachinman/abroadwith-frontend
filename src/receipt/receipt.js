// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var ReceiptContainer = require('./components/receipt-container.react')

if ($('#receipt-container').length) {
  // Trips parent
  ReactDOM.render(
    <ReceiptContainer />, document.querySelector('#receipt-container')
  )
}
