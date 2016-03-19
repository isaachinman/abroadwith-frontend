var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  render: function() {
    return (
      <div className='payment-method'>
        {defaultHTML}
        <div className='number'>
          <span className='grey-text'>XXXXXXXXXXXX</span>{this.props.lastFour}
        </div>
        <div className='secondary grey-text'>
          {this.props.expiry}
        </div>
        <div className='actions'>
          <a onClick={this.props.deletePaymentMethod}>Remove</a>
        </div>
        <div className='type'>
          <i className="fa fa-cc-visa"></i>
        </div>
      </div>
    );
  }
});
