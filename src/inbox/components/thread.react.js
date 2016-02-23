var React = require('react');
var ReceivedMessage = require('./received-message.react');
var SentMessage = require('./sent-message.react');

module.exports = React.createClass({
  renderMessages: function(inputObj, containerObj) {

    var yourId = this.props.yourId;
    var yourPhoto = this.props.yourPhoto;
    var theirPhoto = 'https://img.abroadwith.com' + this.props.theirPhoto;
    inputObj.forEach(function(message) {
      if (message.author === yourId) {
        containerObj.push(
          <SentMessage
            yourPhoto={yourPhoto}
            message={message.message}
            timestamp={message.timestamp}
          />
        )
      } else {
        containerObj.push(
          <ReceivedMessage
            theirPhoto={theirPhoto}
            message={message.message}
            timestamp={message.timestamp}
          />
        )
      }
    })
  },
  sendMessage: function(message) {

    var newMessage = $('input#new-message').val();

    $.ajax({
      type: "POST",
      url: "/users/1/messages/2222",
      data: JSON.stringify({
        message: newMessage
      }),
      contentType: "application/json",
      success: this.refreshMessages()
    });

  },
  refreshMessages: function() {

    var id = this.props.id;
    var newMessageObj = [];

    $.get( 'users/1/messages/'+id+'?size=10', function(response) {

      var messageSetup = JSON.parse(response);

      console.log(messageSetup);

      this.renderMessages(messageSetup, newMessageObj);

      var newState = {
        messages: newMessageObj
      }

      if (this.isMounted()) {
        console.log('state was refreshed')
        this.setState(newState);
      }

    }.bind(this));

  },
  moreMessages: function() {

    // Get timestamp of highest message and send new call with this time

    // Then append new messages

  },
  componentDidMount: function() {

    $.get( "users/1/messages/"+this.props.id+'?size=10', function(response) {

      var initMessages = []
      var messageSetup = JSON.parse(response);
      var yourId = this.props.yourId;
      var yourPhoto = this.props.yourPhoto;
      var theirPhoto = 'https://img.abroadwith.com' + this.props.theirPhoto;

      this.renderMessages(messageSetup, initMessages)

      var newState = {
        messages: initMessages
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
          <input id='new-message' type='text' placeholder='Type a message' />
          <a onClick={this.sendMessage} className='btn btn-primary right'>Send</a>
        </div>

      </div>
    )
  }
});
