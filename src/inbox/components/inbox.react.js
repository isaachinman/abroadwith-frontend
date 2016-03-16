var React = require('react');

var domains = require('domains');
var JWT = require('JWT');
var GET = require('GET');

var Thread = require('./thread.react');

module.exports = React.createClass({
  componentDidMount: function() {

    var url = domains.API + '/users/' + JWT.rid + '/messages';
    var success = function(response) {

      var inboxSetup = response;
      console.log(inboxSetup)

      var yourName = JWT.name;
      var yourId = JWT.rid;
      var yourPhoto = JWT.img ? JWT.img : 'https://tracker.moodle.org/secure/attachment/30912/f3.png';

      var messageHTML = [];
      var threadHTML = [];

      inboxSetup.forEach(function(thread) {

        messageHTML.push(
          <li className='message-trigger' data-target={thread.id}><a>Conversation with {thread.with.name}</a></li>
        );

        threadHTML.push(
          <Thread
            id={thread.id}
            yourName={yourName}
            yourId={yourId}
            yourPhoto={yourPhoto}
            them={thread.with.firstName}
            theirPhoto={thread.with.photo}
            startDate={thread.arrival}
            endDate={thread.departure}
          />
        )

      });

      var newState = {
        messageList: messageHTML,
        threads: threadHTML
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
