var React = require('react');
var toast = require('toast');

module.exports = React.createClass({
  saveBasics: function() {

    adminObj.firstName = $('#firstName').val();
    adminObj.lastName = $('#lastName').val();
    adminObj.gender = $('#gender').val();
    adminObj.birthDate = $('#birthDate').val();
    adminObj.location = $('#user-address').val();
    $('#phoneNumber').intlTelInput('isValidNumber') ? adminObj.phoneNumber = $('#phoneNumber').val() : null;
    adminObj.email = $('#user-email').val();
    adminObj.emergencyContact ? null : adminObj.emergencyContact = {};
    adminObj.emergencyContact.name = $('#emergency-name').val();
    adminObj.emergencyContact.phone = $('#emergency-phone').val();
    adminObj.emergencyContact.email = $('#emergency-email').val();
    adminObj.emergencyContact.relationship = $('#emergency-relationship').val();

    this.props.updateAdmin(function() {
      toast('Basics updated');
    });

    return false;

  },
  componentDidMount: function() {

    $('form#basics-form').submit(this.saveBasics);

    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/8.4.6/js/intlTelInput.min.js', function() {
      $('#phoneNumber').intlTelInput();
      $('#phoneNumber').keyup(function() {
        if (this.value.charAt(0) !== '+') {
          this.value = '+' + this.value;
        }
        $(this).intlTelInput();
      })
      $.getScript('https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/8.4.6/js/utils.js');
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
    $('#user-email').val(this.props.email);
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
