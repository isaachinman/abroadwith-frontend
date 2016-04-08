var React = require('react');
var formatDate = require('format-date');

module.exports = React.createClass({
  render: function() {

    var dateObj = new Date(this.props.timestamp);
    var dateString = formatDate(dateObj);

    return (

      <div className='msg msg--received'>
        <div className='user user--them'>
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
