var React = require('react');

var i18n = require('../../global/util/i18n');
var toast = require('toast')

module.exports = React.createClass({
  saveNotifications: function() {

    adminObj.notifications.email.reminders = $('#email-reminders').prop('checked');
    adminObj.notifications.email.promotion = $('#email-promotions').prop('checked');
    adminObj.notifications.sms.all         = $('#sms-notifications').prop('checked');

    this.props.updateAdmin(function(callback) {
      toast(i18n.t('admin:notifications_toast'));
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
