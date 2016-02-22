var React = require('react');
var Thread = require('./thread.react');

module.exports = React.createClass({
  componentDidMount: function() {


    $.get( "users/1/messages", function(threads) {
      console.log(threads);
    });
    // For each thread
      // Generate sidebar li
        // onclick, initialise thread
      // Generate actual message html

  },
  render: function() {

    var messageList = [];

    return (

      <div id='inbox' class='inbox'>
        <ul class="message-list">
          {messageList}
          <li class='active' data-target='conversation-1'><a>Conversation with Jose</a></li>
          <li data-target='conversation-2'><a>Conversation with Amanda</a></li>
          <li><a>Conversation with Luis</a></li>
        </ul>

        <div id='conversation-1' class='message-body active'>

          <div class='intro-msg'>
            <div class='title'>
              This is a conversation between Jose and Luis
            </div>
            <div class='subtitle'>
              Jose would like to stay with Luis from <strong>01/05/2016</strong> to <strong>01/07/2016</strong>
            </div>
          </div>

          <div class='msg msg--received'>
            <div class='user'>
              <img src="https://www.wystc.org/wp-content/uploads/sites/2/2014/08/Cl%C3%A9ment-Marcelet.png" class="circle responsive-img" />
            </div>
            <div class='contents'>
              Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne.
              <div class='timestamp'>
                2016/01/18
              </div>
            </div>
          </div>

          <div class='msg msg--sent'>
            <div class='user'>
              <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg" class="circle responsive-img" />
            </div>
            <div class='contents'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.
              <br /><br />
              Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.
              <div class='timestamp'>
                2016/01/20
              </div>
            </div>
          </div>

          <div class='msg msg--received'>
            <div class='user'>
              <img src="https://www.wystc.org/wp-content/uploads/sites/2/2014/08/Cl%C3%A9ment-Marcelet.png" class="circle responsive-img" />
            </div>
            <div class='contents'>
              Oporteat dissentias vel eu, an graece ridens per.
              <div class='timestamp'>
                2016/01/25
              </div>
            </div>
          </div>

        </div>

        <div id='conversation-2' class='message-body'>

          <div class='intro-msg'>
            <div class='title'>
              This is a conversation between Jose and Amanda
            </div>
            <div class='subtitle'>
              Jose would like to stay with Amanda from <strong>01/09/2016</strong> to <strong>01/11/2016</strong>
            </div>
          </div>

          <div class='row center-align'>
            <a class='btn-floating center-align load-more-btn'>+</a>
          </div>

          <div class='msg msg--received'>
            <div class='user'>
              <img src="https://www.wystc.org/wp-content/uploads/sites/2/2014/08/Cl%C3%A9ment-Marcelet.png" class="circle responsive-img" />
            </div>
            <div class='contents'>
              Oporteat dissentias vel eu, an graece ridens per. Congue doctus convenire qui id, cu dolores conceptam repudiandae mei, vel zril aliquid ex. Illum eruditi recusabo qui an. Ei nullam graeco mel, pri ut omnesque perpetua vulputate. Et noluisse accommodare vis. Exerci signiferumque vituperatoribus no sit, vitae iisque nusquam ne per, duis erant ius ea. Mel at quodsi explicari, usu tale diam accommodare ne.
              <div class='timestamp'>
                2016/01/18
              </div>
            </div>
          </div>

          <div class='msg msg--received'>
            <div class='user'>
              <img src="https://www.wystc.org/wp-content/uploads/sites/2/2014/08/Cl%C3%A9ment-Marcelet.png" class="circle responsive-img" />
            </div>
            <div class='contents'>
              Oporteat dissentias vel eu, an graece ridens per.
              <div class='timestamp'>
                2016/01/25
              </div>
            </div>
          </div>

          <div class='msg msg--sent'>
            <div class='user'>
              <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg" class="circle responsive-img" />
            </div>
            <div class='contents'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.
              <br /><br />
              Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.
              <div class='timestamp'>
                2016/01/20
              </div>
            </div>
          </div>

          <div class='msg msg--sent'>
            <div class='user'>
              <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg" class="circle responsive-img" />
            </div>
            <div class='contents'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.
              <br /><br />
              Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.
              <div class='timestamp'>
                2016/01/20
              </div>
            </div>
          </div>

        </div>

        <div class='send-message'>
          <input type='text' placeholder='Type a message' />
          <a class='btn btn-primary right'>Send</a>
        </div>
      </div>

    )
  }
});
