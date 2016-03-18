var React = require('react');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['common', 'inbox']);

module.exports = React.createClass({
  render: function() {

    return (
      <div className='message-body'>

        <div className='intro-msg'>
          <div className='title'>
            You have no messages
          </div>
          <div className='subtitle'>
            When someone messages you, this is where the message will appear!
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
