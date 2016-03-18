var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  render: function() {
    return (
      <div className='payment-method'>
        <div className='number'>
          {this.props.email}
        </div>
        <div className='secondary grey-text'>
          Connected
        </div>
        <div className='actions'>
          <a onClick={this.props.deletePaymentMethod}>Remove</a>
        </div>
        <div className='type'>
          <i className="fa fa-cc-paypal"></i>
        </div>
      </div>
    );
  }
});
