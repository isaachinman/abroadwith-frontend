// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var InvoiceContainer = require('./components/invoice-container.react');

if ($('#invoice-container').length) {
  // Trips parent
  ReactDOM.render(
    <InvoiceContainer />, document.querySelector('#invoice-container')
  )
}
