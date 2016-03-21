var React = require('react');
var ReceivedMessage = require('./received-message.react');
var SentMessage = require('./sent-message.react');

var domains = require('domains');
var JWT = require('JWT');
var GET = require('GET');
var POST = require('POST');

var i18n = require('../../global/util/i18n');

module.exports = React.createClass({
  renderMessages: function(inputObj, containerObj) {

    var yourId = this.props.yourId;
    var yourPhoto = this.props.yourPhoto;
    var theirPhoto = this.props.theirPhoto;
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

      var message = {
        message: newMessage
      }

      var url = domains.API + '/users/' + JWT.rid + '/messages/' + this.props.id;
      var success = function() {
        this.refreshMessages()
      }.bind(this)
      POST(url, message, success);

    }

  },
  refreshMessages: function() {

    var id = this.props.id;
    var messages = [];

    var url = domains.API + '/users/' + JWT.rid + '/messages/' + this.props.id + '?size=10';
    var success = function(response) {

      var messageSetup = response;

      console.log(messageSetup);

      this.renderMessages(messageSetup, messages);

      var newState = {
        messages: messages
      }

      if (this.isMounted()) {
        this.setState(newState);
      }

      var activeMsg = $('.message-body.active');
      activeMsg.scrollTop(activeMsg[0].scrollHeight);

    }.bind(this);
    GET(url, success)

  },
  moreMessages: function() {

    var id = this.props.id;
    var yourId = this.props.yourId;
    var yourPhoto = this.props.yourPhoto;
    var theirPhoto = this.props.theirPhoto;

    var lastTimestamp = this.state.messages[0].props.timestamp;

    var messages = this.state.messages;
    var newMessages = [];

    var url = domains.API + '/users/' + JWT.rid + '/messages/' + this.props.id + '?size=10&timestamp=' + lastTimestamp;
    var success = function(response) {

      response.forEach(function(message) {
        if (message.author === yourId) {
          messages.unshift(
            <SentMessage
              yourPhoto={yourPhoto}
              message={message.message}
              timestamp={message.timestamp}
            />
          )
        } else {
          messages.unshift(
            <ReceivedMessage
              theirPhoto={theirPhoto}
              message={message.message}
              timestamp={message.timestamp}
            />
          )
        }
      })

      var newState = {
        messages: messages
      }

      this.setState(newState);

    }.bind(this);
    GET(url, success)

  },
  componentDidMount: function() {

    var url = domains.API + '/users/' + JWT.rid + '/messages/' + this.props.id + '?size=10';
    var success = function(response) {

      console.log(response)

      var messages = []

      this.renderMessages(response, messages)

      var newState = {
        messages: messages
      }

      if (this.isMounted()) {
        this.setState(newState);
      }

    }.bind(this);
    GET(url, success)

  },
  render: function() {

    var sendBtn = this.props.id + '-send';

    return (
      <div id={this.props.id} className='message-body'>

        <div className='intro-msg'>
          <div className='title'>
            {i18n.t('inbox:this_is_a_conversation')} {this.props.them}
          </div>
          <div className='subtitle'>
            {this.props.them} {i18n.t('inbox:intro_msg_stay')} {this.props.yourName} {i18n.t('common:words.from')} <strong>{this.props.startDate}</strong> {i18n.t('common:words.to')} <strong>{this.props.endDate}</strong>
          </div>
        </div>

        <div className='col s12 center-align'>
          <a className='btn btn-secondary load-more' onClick={this.moreMessages}>{i18n.t('inbox:load_previous')}</a>
        </div>

        {this.state.messages}

        <div className='send-message'>
          <form onSubmit={this.sendMessage}>
            <textarea id={sendBtn} type='text' className='materialize-textarea' maxLength='2000' placeholder={i18n.t('inbox:input_placeholder')} />
            <a onClick={this.sendMessage} className='btn btn-primary right'>{i18n.t('common:words.Send')}</a>
          </form>
        </div>

      </div>
    )
  }
});
