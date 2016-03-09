var React = require('react');
var Basics = require('./admin-basics.react');
var Notifications = require('./admin-notifications.react')
var Payments = require('./admin-payments.react');
var Languages = require('./admin-languages.react');

var domains = require('domains');
var jwt_decode = require('jwt-decode');

module.exports = React.createClass({
  updateAdmin: function(callback) {

    $('#preloader').show();

    var refreshState = this.refreshState();

    if (adminObj.address === null || adminObj.address.country === null) {

      sendObj(refreshState);

      // $.ajax({
      //   url: '//freegeoip.net/json/',
      //   type: 'POST',
      //   dataType: 'jsonp',
      //   success: function(location) {
      //
      //     adminObj.address = {};
      //     adminObj.address.country = location.country_name;
      //     adminObj.address.city = location.city;
      //
      //     sendObj(refreshState);
      //
      //   },
      //   error: function() {
      //     sendObj(refreshState);
      //   }
      // });

    } else {
      sendObj(refreshState);
    }

    function sendObj() {
      var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

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
    var JWT = localStorage.getItem('JWT') !== null
      ? jwt_decode(localStorage.getItem('JWT'))
      : null;

    $.ajax({
      url: domains.API + '/users/' + JWT.rid,
      type: "GET",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))
      },
      success: function(response) {

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
        }['email', 'phone', 'id'].forEach(checkVerifications);

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
          emergencyName: response.emergencyContact && response.emergencyContact.name
            ? response.emergencyContact.name
            : null,
          emergencyPhone: response.emergencyContact && response.emergencyContact.phone
            ? response.emergencyContact.phone
            : null,
          emergencyEmail: response.emergencyContact && response.emergencyContact.email
            ? response.emergencyContact.email
            : null,
          emergencyRelationship: response.emergencyContact && response.emergencyContact.relationship
            ? response.emergencyContact.relationship
            : null,

          emailReminders: response.notifications.email.reminders,
          emailPromotions: response.notifications.email.promotions,
          smsNotifications: response.notifications.sms.all
        }

        if (this.isMounted()) {
          this.setState(newState);
        };

      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })
  },
  componentDidMount: function() {

    this.refreshState();

    // Delete account button
    $('#delete-account').click(function() {

      var JWT = localStorage.getItem('JWT') !== null
        ? jwt_decode(localStorage.getItem('JWT'))
        : null;

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
        <Basics firstName={this.state.firstName} lastName={this.state.lastName} gender={this.state.gender} birthDate={this.state.birthDate} location={this.state.location} phoneNumber={this.state.phoneNumber} email={this.state.email} emergencyName={this.state.emergencyName} emergencyPhone={this.state.emergencyPhone} emergencyEmail={this.state.emergencyEmail} emergencyRelationship={this.state.emergencyRelationship} updateAdmin={this.updateAdmin}/>
        <Notifications emailReminders={this.state.emailReminders} emailPromotions={this.state.emailPromotions} sms={this.state.smsNotifications} updateAdmin={this.updateAdmin}/>
        <Payments paymentMethods={this.state.paymentMethods} payoutMethods={this.state.payoutMethods} updateAdmin={this.updateAdmin}/>
        <Languages languagesLearning={this.state.languagesLearning} languagesKnown={this.state.languagesKnown} updateAdmin={this.updateAdmin}/>
      </div>

    )
  }
});
