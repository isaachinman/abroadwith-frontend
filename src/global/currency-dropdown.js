var React = require('react');
var ReactDOM = require('react-dom');
var Cookies = require('js-cookie');

var UiCurrency = React.createClass({
  componentDidUpdate: function() {
  },
  componentDidMount: function() {

    console.log('mounted')

    if (Cookies.get('ui-currency') !== 'undefined') {
      $('select#ui-currency').val(Cookies.get('ui-currency'))
    } else {
        Cookies.set('ui-currency', $('select#ui-currency').val());
    }

    $('select#ui-currency').change(function() {
      Cookies.set('ui-currency', $(this).val());
      console.log(Cookies.get('ui-currency'))
    })

  },
  render: function() {

    return (
      <div></div>
    );
  }
});

if ($('#ui-language-container').length) {
  ReactDOM.render(
    <UiCurrency />, document.getElementById('ui-language-container')
  );
}
