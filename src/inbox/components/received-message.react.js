var React = require('react');
require('../../utils/date-object-to-yyyymmdd');

module.exports = React.createClass({
  render: function() {

    var dateObj = new Date(this.props.timestamp);
    var dateString = dateObj.yyyymmdd();

    return (

      <div className='msg msg--received'>
        <div className='user'>
          <img src={this.props.theirPhoto} className="circle responsive-img" />
        </div>
        <div className='contents'>
          {this.props.message}
          <div className='timestamp'>
            {dateString}
          </div>
        </div>
      </div>

    )
  }
});
