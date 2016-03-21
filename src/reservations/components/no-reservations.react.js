var React = require('react');

var i18n = require('../../global/components/i18n');

module.exports = React.createClass({
  render: function() {

    return (

      <li>
        <div className="collapsible-header center-align disabled">
          {i18n.t('trips:no_reservations')}
        </div>
      </li>

    );
  }
});
