var React = require('react');

var jwt_decode = require('jwt-decode');
var domains = require('domains');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['trips', 'common', 'countries']);

module.exports = React.createClass({
  componentDidMount: function() {

    console.log(this.props.reservation)

  },
  render: function() {

    return (

      <li></li>

    );
  }
});
