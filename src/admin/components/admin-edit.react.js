var React = require('react');
var Basics = require('./admin-basics.react');
var Notifications = require('./admin-notifications.react');
var Payments = require('./admin-payments.react');
var Languages = require('./admin-languages.react');
var Verifications = require('./admin-verifications.react');

var toast = require('toast');

var domains = require('domains');
var JWT = require('JWT');
var GET = require('GET');
var POST = require('POST');
var DELETE = require('DELETE');

module.exports = React.createClass({
  updateAdmin: function(firstCallback) {

    $('#preloader').show();

    sendObj(this.refreshState);

    function sendObj(callback) {

      delete adminObj.paymentMethods;
      delete adminObj.payoutMethods;
      delete adminObj.verifications;
      delete adminObj.email;

      console.log(adminObj)

      var url = domains.API + '/users/' + JWT.rid;
      var success = function() {
        $('#preloader').hide();
        callback();
        typeof firstCallback === 'function' ? firstCallback() : null;
      }
      POST(url, adminObj, success);

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

    // Reset password button
    $('a#change-password').click(function() {

      $('#preloader').show();

      $.ajax({
        type: "POST",
        url: domains.API + '/passwords/reset',
        contentType: "application/json",
        data: JSON.stringify({email:JWT.email}),
        success: function() {
          $('#preloader').hide();
          toast('Password reset email sent', 4000)
        },
        error: function() {
          $('#preloader').hide();
        }
      })

    })

    // Delete account button
    $('#delete-account').click(function() {
      var url = domains.API + '/users/' + JWT.rid;
      var success = function() {
        localStorage.removeItem('JWT');
        document.location.href = "/";
      }
      DELETE(url, success);
    })

    // All google maps stuff here
    $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBQW0Z5fmFm8snLhXDOVuD8YuegwCMigqQ&libraries=places", function() {

      var placeSearch,
        autocomplete;
      var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'short_name',
        country: 'short_name',
        postal_code: 'short_name'
      };

      var newAddress = {};

      // Home address autocomplete
      homeAddressAutocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('user-address')), {types: ['geocode']});
      homeAddressAutocomplete.addListener('place_changed', function() {
        // Get the place details from the autocomplete object.
        var place = homeAddressAutocomplete.getPlace();

        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            newAddress[addressType] = val;
          }
        }
        adminObj.address === null ? adminObj.address = {} : null;
        newAddress.locality ? adminObj.address.city = newAddress.locality : null;
        newAddress.country ? adminObj.address.country = newAddress.country : null;
      });
    });
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
