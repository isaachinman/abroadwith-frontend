const React = require('react');
const ReactDOM = require('react-dom');

const i18n = require('i18n');

module.exports = React.createClass({
  render: function() {
    if (this.props.default === true) {
      var defaultHTML = <div className='default-payment-overlay'></div>;
      var defaultText = <span className="grey-text text-darken-1">Default</span>;
    } else {
      var defaultHTML = null;
      var defaultText = <a onClick={this.props.setPayoutMethodDefault}>{i18n.t('common:Set_as_default')}</a>;
    }
    return (
      <div className='payment-method'>
        {defaultHTML}
        <div className='number'>
          {this.props.email}
        </div>
        <div className='secondary grey-text'>
          {i18n.t('common:Connected')}
        </div>
        <div className='actions'>
          {defaultText}
          <a onClick={this.props.deletePayoutMethod}>{i18n.t('common:Remove')}</a>
        </div>
        <div className='type'>
          <i className="fa fa-cc-paypal"></i>
        </div>
      </div>
    );
  }
});
