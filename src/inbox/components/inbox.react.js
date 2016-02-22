var React = require('react');
var Thread = require('./thread.react');

module.exports = React.createClass({
  componentDidMount: function() {

    $.get( "users/1/messages", function(response) {
      var inboxSetup = JSON.parse(response);
      console.log(inboxSetup)

      var yourName = inboxSetup.current_user.name;
      var yourId = inboxSetup.current_user.id;
      var yourPhoto = 'https://img.abroadwith.com' + inboxSetup.current_user.photo;

      var messageHTML = [];
      var threadHTML = [];

      inboxSetup.threads.forEach(function(thread) {

        messageHTML.push(
          <li className='message-trigger' data-target={thread.id}><a>Conversation with {thread.with.name}</a></li>
        );

        threadHTML.push(
          <Thread
            id={thread.id}
            yourName={yourName}
            yourId={yourId}
            yourPhoto={yourPhoto}
            them={thread.with.name}
            theirPhoto={thread.with.photo}
            startDate={thread.from_date}
            endDate={thread.to_date}
          />
        )

      });

      var newState = {
        messageList: messageHTML,
        threads: threadHTML
      }

      if (this.isMounted()) {
        this.setState(newState);
      }

      // Scroll to bottom of conversation thread
      if ($('.message-body').length) {
        $('.message-body').scrollTop($('.message-body')[0].scrollHeight);
      }

      // Hide and show conversations
      $('ul.message-list li').click(function() {
        if ($(this).attr('data-target') != null) {
          $('ul.message-list li').removeClass('active');
          $(this).addClass('active');
          var target = $(this).attr('data-target');
          $('.message-body').removeClass('active');
          $('#'+target).addClass('active');
          $('#'+target).scrollTop($('#'+target)[0].scrollHeight);
        }
      })

      $('li.message-trigger:first-child').trigger('click');

    }.bind(this));
    // For each thread
      // Generate sidebar li
        // onclick, initialise thread
      // Generate actual message html

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
