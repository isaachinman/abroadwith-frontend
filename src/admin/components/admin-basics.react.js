var React = require('react');
var toast = require('toast');

var i18n = require('../../global/util/i18n');

var refreshToken = require('refresh-token');

module.exports = React.createClass({
  saveBasics: function() {

    adminObj.firstName = $('#firstName').val();
    adminObj.lastName = $('#lastName').val();
    adminObj.gender = $('#gender').val();
    adminObj.birthDate = $('#birthDate').val();
    adminObj.location = $('#user-address').val();
    adminObj.phoneNumber = $('#phoneNumber').intlTelInput('isValidNumber') ? $('#phoneNumber').val() : null;
    adminObj.emergencyContact ? null : adminObj.emergencyContact = {};
    adminObj.emergencyContact.name = $('#emergency-name').val();
    adminObj.emergencyContact.phone = $('#emergency-phone').val();
    adminObj.emergencyContact.email = $('#emergency-email').val();
    adminObj.emergencyContact.relationship = $('#emergency-relationship').val();

    this.props.updateAdmin(function() {
      $('#preloader').show();
      refreshToken(function() {
        $('#preloader').hide();
        toast(i18n.t('admin:basics_toast'));
      });
    });

    return false;

  },
  componentDidMount: function() {

    $('form#basics-form').submit(this.saveBasics);

    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/8.4.6/js/intlTelInput.min.js', function() {

      var countryData = $.fn.intlTelInput.getCountryData();
      $.each(countryData, function(i, country) {
        country.name = i18n.t('countries:'+(country.iso2).toUpperCase());
      });

      // Re-alphabetise translated country names
      countryData.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );

      $.getScript('https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/8.4.6/js/utils.js', function() {

        $('#phoneNumber').intlTelInput();

        $('#phoneNumber').blur(function() {
          if (this.value.charAt(0) !== '+') {
            this.value = '+' + this.value;
          }
          $(this).intlTelInput();
        });

      });
    })

  },
  componentDidUpdate: function() {

    // Basics tab
    $('#firstName').val(this.props.firstName);
    $('#lastName').val(this.props.lastName);
    $('#gender').val(this.props.gender);
    $('#birthDate').val(this.props.birthDate);
    $('#user-address').val(this.props.location);
    $('#phoneNumber').val(this.props.phoneNumber);
    $('#user-email').html(this.props.email);
    $('#emergency-name').val(this.props.emergencyName);
    $('#emergency-phone').val(this.props.emergencyPhone);
    $('#emergency-email').val(this.props.emergencyEmail);
    $('#emergency-relationship').val(this.props.emergencyRelationship);

    $('select#gender').material_select();

    $('#phoneNumber').trigger('keyup');

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
