const React = require('react');
const ReactDOM = require('react-dom');
const Cookies = require('js-cookie');

var UiCurrency = React.createClass({
  componentDidMount: function() {

    if (Cookies.get('ui-currency') == undefined) {
      Cookies.set('ui-currency', 'EUR');
    } else {
      $('select#ui-currency').val(Cookies.get('ui-currency'));
      $('select#ui-currency').material_select();
    }

    if (Cookies.get('ui-language') !== 'undefined') {
      $('select#ui-language option[value='+Cookies.get('ui-language')+']').attr('selected', 'selected');
    }

    $('select#ui-currency').change(function() {
      Cookies.set('ui-currency', $(this).val());
    })

    $('select#ui-language').change(function() {
      Cookies.set('ui-language', $(this).val());
      location.reload();
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
