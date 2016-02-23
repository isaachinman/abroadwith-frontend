var React = require('react');
var ReceivedMessage = require('./received-message.react');
var SentMessage = require('./sent-message.react');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['common', 'inbox']);

module.exports = React.createClass({
  renderMessages: function(inputObj, containerObj) {

    var yourId = this.props.yourId;
    var yourPhoto = this.props.yourPhoto;
    var theirPhoto = 'https://img.abroadwith.com' + this.props.theirPhoto;
    inputObj.reverse().forEach(function(message) {
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
  sendMessage: function(e) {

    e.preventDefault();

    var id = this.props.id;
    var input = $('#' + this.props.id + '-send');
    var newMessage = input.val();

    if (newMessage !== '') {

      input.val('');

      $.ajax({
        type: "POST",
        url: "/users/1/messages/"+id,
        data: JSON.stringify({
          message: newMessage
        }),
        contentType: "application/json",
        success: this.refreshMessages()
      });

    }


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
        this.setState(newState);
      }

      var activeMsg = $('.message-body.active');
      activeMsg.scrollTop(activeMsg[0].scrollHeight);

    }.bind(this));

  },
  moreMessages: function() {

    var activeMsg = $('.message-body.active');

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

    var sendBtn = this.props.id + '-send';

    return (
      <div id={this.props.id} className='message-body'>

        <div className='intro-msg'>
          <div className='title'>
            This is a conversation between you and {this.props.them}
          </div>
          <div className='subtitle'>
            {this.props.yourName} i18n.t('inbox:intro_msg_stay') {this.props.them} from <strong>{this.props.startDate}</strong> to <strong>{this.props.endDate}</strong>
          </div>
        </div>

        <div className='col s12 center-align'>
          <a className='btn btn-secondary load-more'>Load previous</a>
        </div>

        {this.state.messages}

        <div className='send-message'>
          <form onSubmit={this.sendMessage}>
            <textarea id={sendBtn} type='text' className='materialize-textarea' maxLength='2000' placeholder='Type a message' />
            <a onClick={this.sendMessage} className='btn btn-primary right'>Send</a>
          </form>
        </div>

      </div>
    )
  }
});
