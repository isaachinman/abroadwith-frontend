var React = require('react');

var i18n = require('../../global/components/i18n');

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
