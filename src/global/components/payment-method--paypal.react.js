var React = require('react');
var ReactDOM = require('react-dom');

var i18n = require('../util/i18n');

module.exports = React.createClass({
  render: function() {
    return (
      <div className='payment-method'>
        <div className='number'>
          {this.props.email}
        </div>
        <div className='secondary grey-text'>
          {i18n.t('common:Connected')}
        </div>
        <div className='actions'>
          <a onClick={this.props.deletePaymentMethod}>{i18n.t('common:Remove')}</a>
        </div>
        <div className='type'>
          <i className="fa fa-cc-paypal"></i>
        </div>
      </div>
    );
  }
});
