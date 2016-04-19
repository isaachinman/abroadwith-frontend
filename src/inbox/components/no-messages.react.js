const React = require('react');

const i18n = require('i18n');

module.exports = React.createClass({
  render: function() {

    return (
      <div className='message-body active'>

        <div className='intro-msg'>
          <div className='title'>
            {i18n.t('inbox:no_messages_title')}
          </div>
          <div className='subtitle'>
            {i18n.t('inbox:thread_will_be_here')}
          </div>
        </div>

      </div>
    )
  }
});
