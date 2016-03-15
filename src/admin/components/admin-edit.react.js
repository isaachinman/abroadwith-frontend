var React = require('react');
var Basics = require('./admin-basics.react');
var Notifications = require('./admin-notifications.react');
var Payments = require('./admin-payments.react');
var Languages = require('./admin-languages.react');
var Verifications = require('./admin-verifications.react');

var JWT = require('JWT');
var GET = require('GET');

var domains = require('domains');


module.exports = React.createClass({
  updateAdmin: function(callback) {

    $('#preloader').show();

    sendObj(this.refreshState);

    function sendObj(callback) {

      delete adminObj.paymentMethods;
      delete adminObj.payoutMethods;
      delete adminObj.verifications;

      console.log(adminObj)

      $.ajax({
        url: domains.API + '/users/' + JWT.rid,
        type: "POST",
        data: JSON.stringify(adminObj),
        contentType: "application/json",
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))
        },
        success: function(response) {

          $('#preloader').hide();
          callback();

        }.bind(this),
        error: function() {

          alert('Something failed');

        }
      })
    }

  },
  refreshState: function() {

    var url = domains.API + '/users/' + JWT.rid;
    var success = function(response) {

      window.adminObj = response;

      console.log(response)

      // Notifications tab
      $('#email-reminders').prop('checked', response.notifications.email.reminders)
      $('#email-promotions').prop('checked', response.notifications.email.promotion)
      $('#sms-notifications').prop('checked', response.notifications.sms.all)

      // Verifications
      function checkVerifications(type) {
        if (response.verifications[type] === true) {
          $('#verification-' + type + ' .collapsible-header').addClass('disabled');
          $('#verification-' + type + ' .edit').html('<i class="fa fa-check-circle green-text fa-2x"></i>');
        }
      }
      ['email', 'phone', 'id'].forEach(checkVerifications);

      var newState = {
        // Set new state vars
        paymentMethods: response.paymentMethods,
        payoutMethods: response.payoutMethods,
        languagesLearning: response.userLearningLanguages,
        languagesKnown: response.userKnownLanguages,

        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        birthDate: response.birthDate,
        location: response.location,
        phoneNumber: response.phoneNumber,
        email: response.email,
        emergencyName: response.emergencyContact && response.emergencyContact.name ? response.emergencyContact.name : null,
        emergencyPhone: response.emergencyContact && response.emergencyContact.phone ? response.emergencyContact.phone : null,
        emergencyEmail: response.emergencyContact && response.emergencyContact.email ? response.emergencyContact.email : null,
        emergencyRelationship: response.emergencyContact && response.emergencyContact.relationship ? response.emergencyContact.relationship : null,
        emailReminders: response.notifications.email.reminders,
        emailPromotions: response.notifications.email.promotions,
        smsNotifications: response.notifications.sms.all
      }

      this.setState(newState);

    }.bind(this);
    GET(url, success)

  },
  componentDidMount: function() {

    this.refreshState();

    // Delete account button
    $('#delete-account').click(function() {

      $.ajax({
        url: domains.API + '/users/' + JWT.rid,
        type: 'DELETE',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))
        },
        success: function(result) {

          localStorage.removeItem('JWT');
          document.location.href = "/";

        }
      });
    })

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
        <Verifications
          phoneNumber={this.state.phoneNumber}
          updateAdmin={this.updateAdmin}
        />
      </div>

    )
  }
});
