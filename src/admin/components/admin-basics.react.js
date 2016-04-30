const React = require('react');
const toast = require('toast');

const i18n = require('i18n')

const intlTelInput = require('intl-tel-input')

const apiDate = require('api-date')
const uiDate = require('ui-date')

const refreshToken = require('refresh-token');

module.exports = React.createClass({
  saveBasics: function() {

    adminObj.firstName = $('#firstName').val();
    adminObj.lastName = $('#lastName').val();
    adminObj.gender = $('#gender').val();
    adminObj.birthDate = apiDate($('#birthDate').val());
    adminObj.location = $('#user-address').val();
    adminObj.phoneNumber = $('#phoneNumber').intlTelInput('isValidNumber') ? $('#phoneNumber').intlTelInput('getNumber') : null;
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

    $('#phoneNumber').intlTelInput({
      nationalMode: true,
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/8.4.6/js/utils.js"
    });

  },
  componentDidUpdate: function() {

    // Basics tab
    $('#firstName').val(this.props.firstName);
    $('#lastName').val(this.props.lastName);
    $('#gender').val(this.props.gender);
    $('#birthDate').val(uiDate(this.props.birthDate));
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
