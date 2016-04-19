const React = require('react');
const Thread = require('./thread.react');
const NoMessages = require('./no-messages.react');

const i18n = require('i18n');

const domains = require('domains');
const JWT = require('JWT');
const GET = require('GET');

module.exports = React.createClass({
  componentDidMount: function() {

    $('#preloader').show();

    var url = domains.API + '/users/' + JWT.rid + '/messages';
    var success = function(response) {

      console.log(response)

      var yourName = JWT.name;
      var yourId = JWT.rid;
      var yourPhoto = JWT.img ? domains.IMG + JWT.img : domains.IMG + '/users/default.jpg';

      var messageHTML = [];
      var threadHTML = [];

      if (response.length > 0) {

        response.forEach(function(thread) {

          messageHTML.push(
            <li className='message-trigger' data-target={thread.id}><a>Conversation with {thread.with.firstName}</a></li>
          );

          var theirPhoto = thread.with.photo !== null ? domains.IMG + thread.with.photo : domains.IMG + '/users/default.jpg';

          threadHTML.push(
            <Thread
              id={thread.id}
              yourName={yourName}
              yourId={yourId}
              yourPhoto={yourPhoto}
              them={thread.with.firstName}
              theirPhoto={theirPhoto}
              startDate={thread.arrival}
              endDate={thread.departure}
            />
          )

        });

        var newState = {
          messageList: messageHTML,
          threads: threadHTML
        }

      } else {
        messageHTML.push(<li><a className='grey-text'>{i18n.t('inbox:no_messages')}</a></li>)
        threadHTML.push(<NoMessages />)
        var newState = {
          messageList: messageHTML,
          threads: threadHTML
        }
      }

      if (this.isMounted()) {

        this.setState(newState, function() {

          function activateThread() {
            if ($(this).attr('data-target') != null) {
              $('ul.message-list li').removeClass('active');
              $(this).addClass('active');
              var target = $(this).attr('data-target');
              $('.message-body').removeClass('active');
              $('#'+target).addClass('active');
              $('#'+target).scrollTop($('#'+target)[0].scrollHeight);
            }
          }

          $('ul.message-list li.message-trigger').click(activateThread);
          $('ul.message-list li:first-child').trigger('click');

        });

      }

      $('#preloader').hide();


    }.bind(this);
    GET(url, success)


  },
  render: function() {

    return (

      <div id='inbox' className='inbox'>
        <ul className="message-list">
          {this.state.messageList}
        </ul>

        {this.state.threads}

      </div>

    )
  }
});
