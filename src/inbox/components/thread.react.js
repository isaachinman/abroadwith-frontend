var React = require('react');
var ReceivedMessage = require('./received-message.react');
var SentMessage = require('./sent-message.react');

module.exports = React.createClass({
  sendMessage: function() {

    var newState = this.state.messages;

    $.post( "users/1/messages/"+this.props.id, function(response) {

      // New GET and state

    })

  },
  moreMessages: function() {

    // Get timestamp of highest message and send new call with this time

    // Then append new messages

  },
  componentDidMount: function() {

    $.get( "users/1/messages/"+this.props.id+'?size=5', function(response) {

      var allMessages = []
      var messageSetup = JSON.parse(response);
      var yourId = this.props.yourId;
      var yourPhoto = this.props.yourPhoto;
      var theirPhoto = 'https://img.abroadwith.com' + this.props.theirPhoto;

      messageSetup.forEach(function(message) {

        if (message.author === yourId) {
          allMessages.push(
            <SentMessage
              yourPhoto={yourPhoto}
              message={message.message}
              timestamp={message.timestamp}
            />
          )
        } else {
          allMessages.push(
            <ReceivedMessage
              theirPhoto={theirPhoto}
              message={message.message}
              timestamp={message.timestamp}
            />
          )
        }

      })

      var newState = {
        messages: allMessages
      }

      if (this.isMounted()) {
        this.setState(newState);
      }

    }.bind(this));

  },
  render: function() {

    return (
      <div id={this.props.id} className='message-body'>

        <div className='intro-msg'>
          <div className='title'>
            This is a conversation between you and {this.props.them}
          </div>
          <div className='subtitle'>
            {this.props.yourName} would like to stay with {this.props.them} from <strong>{this.props.startDate}</strong> to <strong>{this.props.endDate}</strong>
          </div>
        </div>

        {this.state.messages}

        <div className='send-message'>
          <input type='text' placeholder='Type a message' />
          <a onClick={this.sendMessage} className='btn btn-primary right'>Send</a>
        </div>

      </div>
    )
  }
});
