var React = require('react');

module.exports = React.createClass({
  componentDidUpdate: function() {
  },
  componentDidMount: function() {
  },
  render: function() {

    return (
      <div className='col s4'>
        <div className='add-payment'>
          <a className='overlay'></a>
          <div className='add'>
            +
          </div>
          <div className='text'>
            Add new payment method
          </div>
        </div>
      </div>
    );
  }
});
