// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var InvoiceContainer = require('./components/invoice-container.react');
var i18n = require('../global/util/i18n');

if ($('#invoice-container').length) {
  i18n.loadNamespaces(['countries', 'receipts_invoices'],function(){
    // Invoice parent
    ReactDOM.render(
      <InvoiceContainer />, document.querySelector('#invoice-container')
    )
  });
}
