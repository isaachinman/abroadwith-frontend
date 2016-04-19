const React = require('react');
const ReactDOM = require('react-dom');

const ReceiptContainer = require('./components/immersion-confirmation-container.react');
const i18n = require('i18n');

if ($('#immersion-confirmation-container').length) {
  i18n.loadNamespaces(['immersions', 'trips', 'languages', 'receipts_invoices'],function(){
    // Receipt parent
    ReactDOM.render(
      <ReceiptContainer />, document.querySelector('#immersion-confirmation-container')
    )
  });
}
