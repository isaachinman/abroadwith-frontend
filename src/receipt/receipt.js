// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var ReceiptContainer = require('./components/receipt-container.react');
var i18n = require('../global/util/i18n');

if ($('#receipt-container').length) {
  i18n.loadNamespaces(['immersions', 'trips', 'languages', 'receipts_invoices'],function(){
    // Receipt parent
    ReactDOM.render(
      <ReceiptContainer />, document.querySelector('#receipt-container')
    )
  });
}
