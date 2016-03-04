var React = require('react');
var ReactDOM = require('react-dom');
var Cookies = require('js-cookie');

var UiCurrency = React.createClass({
  componentDidUpdate: function() {
  },
  componentDidMount: function() {

    console.log('mounted')

    // Set cookie to UI currency
    Cookies.set('ui-currency', $('select#ui-currency').val());

    $('select#ui-currency').change(function() {
      Cookies.set('ui-currency', $(this).val());
      console.log(Cookies.get('ui-currency'))
    })

    console.log(Cookies.get('ui-currency'))

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
