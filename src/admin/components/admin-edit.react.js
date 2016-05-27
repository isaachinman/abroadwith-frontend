const React = require('react');
const Basics = require('./admin-basics.react');
const Notifications = require('./admin-notifications.react');
const Payments = require('./admin-payments.react');
const Languages = require('./admin-languages.react');
const Verifications = require('./admin-verifications.react');

var GoogleMapsLoader = require('google-maps')
GoogleMapsLoader.KEY = 'AIzaSyBQW0Z5fmFm8snLhXDOVuD8YuegwCMigqQ'
GoogleMapsLoader.LIBRARIES = ['places']

const toast = require('toast');
const i18n = require('../../global/util/i18n');

const domains = require('domains');
const JWT = require('JWT');
const GET = require('GET');
const POST = require('POST');
const DELETE = require('DELETE');
const logout = require('logout')

module.exports = React.createClass({
  updateAdmin: function(firstCallback) {

    $('#preloader').show();

    sendObj(this.refreshState);

    function sendObj(callback) {

      delete adminObj.paymentMethods;
      delete adminObj.payoutMethods;
      delete adminObj.verifications;
      delete adminObj.email;

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
        smsNotifications: response.notifications.sms.all,
        verifications: response.verifications
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
          toast(i18n.t('admin:password_reset_toast'));
        },
        error: function() {
          $('#preloader').hide();
        }
      })

    })

    // Delete account button
    $('#delete-account').click(function() {

      $('#preloader').show();

      var url = domains.API + '/users/' + JWT.rid;
      var success = function() {
        logout()
      }
      var error = function(response) {
        if (response.status === 409) {
          $('#delete-account-modal').closeModal()
          $('#user-deletion-failure').openModal()
        }
      }
      DELETE(url, success, error);
    })

    // All google maps stuff here
    GoogleMapsLoader.load(function(google) {

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
        newAddress.locality ? adminObj.address.city = newAddress.locality : adminObj.address.city = null;
        newAddress.country ? adminObj.address.country = newAddress.country : adminObj.address.country = null;
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
          verifications={this.state.verifications}
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
