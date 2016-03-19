var React = require('react');
var ReactDOM = require('react-dom');
var Cookies = require('js-cookie');

var UiCurrency = React.createClass({
  componentDidUpdate: function() {
  },
  componentDidMount: function() {

    if (Cookies.get('ui-currency') === 'undefined') {
      Cookies.set('ui-currency', 'EUR');
    } else {
      $('select#ui-currency').val(Cookies.get('ui-currency'));
      $('select#ui-currency').material_select();
    }

    $('select#ui-currency').change(function() {
      Cookies.set('ui-currency', $(this).val());
      console.log(Cookies.get('ui-currency'))
    })

    $('select#ui-language').change(function() {
      console.log(window.location.href.replace(/^[^.]*/, $(this).val()))
      window.location = (window.location.href.replace(/^[^.]*/, $(this).val()))
    })

  },
  render: function() {

    return (
      <div></div>
    );
  }
});

if ($('#ui-currency-and-language-container').length) {
  ReactDOM.render(
    <UiCurrency />, document.getElementById('ui-currency-and-language-container')
  );
}
