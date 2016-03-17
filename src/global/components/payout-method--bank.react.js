var React = require('react');

module.exports = React.createClass({
  render: function() {
    if (this.props.default === true) {
      var defaultHTML = <div className='default-payment-overlay'></div>;
      var defaultText = <span className="grey-text text-darken-1">Default</span>;
    } else {
      var defaultHTML = null;
      var defaultText = <a>Set as default</a>;
    }
    return (
      <div className='payment-method'>
        {defaultHTML}
        <div className='number'>
          <span className='grey-text'>XXXXXXXXXXXX</span><span className='grey-text text-darken-1'>{this.props.lastFour}</span>
        </div>
        <div className='secondary grey-text'>
          Bank account
        </div>
        <div className='actions'>
          {defaultText}
          <a>Remove</a>
        </div>
        <div className='type'>
          <i className="fa fa-university"></i>
        </div>
      </div>
    );
  }
});
