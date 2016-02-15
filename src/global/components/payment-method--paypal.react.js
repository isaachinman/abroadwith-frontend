var React = require('react');

module.exports = React.createClass({
  componentDidUpdate: function() {
  },
  componentDidMount: function() {
  },
  render: function() {

    return (
      <div className='col s12 m6 l4'>
        <div className='payment-method'>
          <div className='number'>
            {this.props.email}
          </div>
          <div className='secondary grey-text'>
            Connected
          </div>
          <div className='actions'>
            <a>Set as default</a>
            <a>Remove</a>
          </div>
          <div className='type'>
            <i className="fa fa-cc-paypal"></i>
          </div>
        </div>
      </div>
    );
  }
});
