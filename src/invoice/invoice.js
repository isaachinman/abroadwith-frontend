const React = require('react');
const ReactDOM = require('react-dom');
const InvoiceContainer = require('./components/invoice-container.react');
const i18n = require('i18n');

if ($('#invoice-container').length) {
  i18n.loadNamespaces(['countries', 'receipts_invoices'],function(){
    // Invoice parent
    ReactDOM.render(
      <InvoiceContainer />, document.querySelector('#invoice-container')
    )
  });
}
