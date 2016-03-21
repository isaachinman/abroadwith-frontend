var React = require('react');

var toast = require('toast')

module.exports = React.createClass({
  saveNotifications: function() {

    adminObj.notifications.email.reminders = $('#email-reminders').prop('checked');
    adminObj.notifications.email.promotion = $('#email-promotions').prop('checked');
    adminObj.notifications.sms.all         = $('#sms-notifications').prop('checked');

    console.log(adminObj)

    this.props.updateAdmin(function() {
      toast('Notifications updated');
    });

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
