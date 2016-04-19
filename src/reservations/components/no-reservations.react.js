const React = require('react');

const i18n = require('i18n');

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
