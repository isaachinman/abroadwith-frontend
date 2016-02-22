var React = require('react');

module.exports = React.createClass({
  saveNotifications: function() {

    adminObj.notifications.email.promotion = $('#email-reminders').prop('checked');
    adminObj.notifications.email.reminders = $('#email-promotions').prop('checked');
    adminObj.notifications.sms.all         = $('#sms-notifications').prop('checked');

    console.log(adminObj)

    this.props.updateAdmin();

  },
  componentDidMount: function() {
    $('a#save-notifications').click(this.saveNotifications)
  },
  componentDidUpdate: function() {
    $('#email-reminders').prop('checked', this.props.emailReminders)
    $('#email-promotions').prop('checked', this.props.emailPromotions)
    $('#sms-notifications').prop('checked', this.props.sms)
  },
  render: function() {

    return (
      <div></div>
    );
  }
});
