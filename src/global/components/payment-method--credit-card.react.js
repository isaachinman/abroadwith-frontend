var React = require('react');
var ReactDOM = require('react-dom');

var i18n = require('../util/i18n');

module.exports = React.createClass({
  render: function() {
    return (
      <div className='payment-method'>
        <div className='number'>
          <span className='grey-text'>XXXXXXXXXXXX</span>{this.props.lastFour}
        </div>
        <div className='secondary grey-text'>
          {this.props.expiry}
        </div>
        <div className='actions'>
          <a onClick={this.props.deletePaymentMethod}>{i18n.t('common:Remove')}</a>
        </div>
        <div className='type'>
          <i className="fa fa-cc-visa"></i>
        </div>
      </div>
    );
  }
});
