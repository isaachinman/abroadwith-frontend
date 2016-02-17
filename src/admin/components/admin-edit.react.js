var React = require('react');
var Payments = require('./admin-payments.react')

module.exports = React.createClass({
  componentDidMount: function() {

    $.get(this.props.source, function(data) {

      // Parse the response
      var response = JSON.parse(data);

      // Basics tab
      $('#firstName').val(response.firstName);
      $('#lastName').val(response.lastName);
      $('#gender').val(response.gender);
      $('#birthDate').val(response.birthDate);
      $('#location').val(response.location);
      $('#phoneNumber').val(response.phoneNumber);
      $('#user-email').val(response.email);
      $('#emergency-name').val(response.emergencyContact.name);
      $('#emergency-phone').val(response.emergencyContact.phone);
      $('#emergency-email').val(response.emergencyContact.email);
      $('#emergency-relationship').val(response.emergencyContact.relationship);

      // Notifications tab
      $('#email-reminders').prop('checked', response.notifications.email.reminders)
      $('#email-promotions').prop('checked', response.notifications.email.promotion)
      $('#sms-notifications').prop('checked', response.notifications.sms.all)

      // Verifications
      function checkVerifications(type) {
        if (response.verifications[type] === true) {
          $('#verification-'+type+' .collapsible-header').addClass('disabled');
          $('#verification-'+type+' .edit').html('<i class="fa fa-check-circle green-text fa-2x"></i>');
        }
      }
      ['email','phone','id'].forEach(checkVerifications);

      var newState = {
        // Set new state vars
        paymentMethods:  response.paymentMethods,
        payoutMethods:   response.payoutMethods,
      }

      if (this.isMounted()) {
        this.setState(newState);
      };

    }.bind(this));

  },
  render: function() {

    return (

       <div>
        <Payments
          paymentMethods={this.state.paymentMethods}
          payoutMethods={this.state.payoutMethods}
          />
       </div>

    )
  }
});
