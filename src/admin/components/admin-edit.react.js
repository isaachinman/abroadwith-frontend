var React = require('react');
var Basics = require('./admin-basics.react');
var Notifications = require('./admin-notifications.react')
var Payments = require('./admin-payments.react');
var Languages = require('./admin-languages.react');

module.exports = React.createClass({
  updateAdmin: function() {

    // Post to edit user endpoint and then refresh state
    Materialize.toast('Admin updated', 4000);

  },
  componentDidMount: function() {

    $.get(this.props.source, function(data) {

      // Parse the response
      var response = JSON.parse(data);

      window.adminObj = response;

      console.log(adminObj)

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
        paymentMethods:         response.paymentMethods,
        payoutMethods:          response.payoutMethods,
        languagesLearning:      response.userLearningLanguages,
        languagesKnown:         response.userKnownLanguages,

        firstName:              response.firstName,
        lastName:               response.lastName,
        gender:                 response.gender,
        birthDate:              response.birthDate,
        location:               response.location,
        phoneNumber:            response.phoneNumber,
        email:                  response.email,
        emergencyName:          response.emergencyContact.name,
        emergencyPhone:         response.emergencyContact.phone,
        emergencyEmail:         response.emergencyContact.email,
        emergencyRelationship:  response.emergencyContact.relationship,

        emailReminders:         response.notifications.email.reminders,
        emailPromotions:        response.notifications.email.promotions,
        smsNotifications:       response.notifications.sms.all
      }

      if (this.isMounted()) {
        this.setState(newState);
      };

    }.bind(this));

  },
  render: function() {

    return (

       <div>
        <Basics
          firstName={this.state.firstName}
          lastName={this.state.lastName}
          gender={this.state.gender}
          birthDate={this.state.birthDate}
          location={this.state.location}
          phoneNumber={this.state.phoneNumber}
          email={this.state.email}
          emergencyName={this.state.emergencyName}
          emergencyPhone={this.state.emergencyPhone}
          emergencyEmail={this.state.emergencyEmail}
          emergencyRelationship={this.state.emergencyRelationship}
          updateAdmin={this.updateAdmin}
          />
        <Notifications
          emailReminders={this.state.emailReminders}
          emailPromotions={this.state.emailPromotions}
          sms={this.state.smsNotifications}
          updateAdmin={this.updateAdmin}
          />
        <Payments
          paymentMethods={this.state.paymentMethods}
          payoutMethods={this.state.payoutMethods}
          updateAdmin={this.updateAdmin}
          />
        <Languages
          languagesLearning={this.state.languagesLearning}
          languagesKnown={this.state.languagesKnown}
          updateAdmin={this.updateAdmin}
          />
       </div>

    )
  }
});
