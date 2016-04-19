const React = require('react');
const formattedDate = require('api-date');

module.exports = React.createClass({
  render: function() {

    var dateObj = new Date(this.props.timestamp);
    var dateString = formattedDate(dateObj);

    return (

      <div className='msg msg--sent'>
        <div className='user user--you'>
          <img src={this.props.yourPhoto} className="circle responsive-img" />
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
