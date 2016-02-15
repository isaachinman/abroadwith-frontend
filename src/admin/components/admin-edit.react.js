var React = require('react');

module.exports = React.createClass({
  componentDidMount: function() {

    $.get(this.props.source, function(data) {

      // Parse the response
      var response = JSON.parse(data);

      console.log(response);

      // Basics tab
      $('#firstName').val(response.admin.firstName);
      $('#lastName').val(response.admin.lastName);
      $('#gender').val(response.admin.gender);
      $('#birthDate').val(response.admin.birthDate);
      $('#location').val(response.admin.location);
      $('#phoneNumber').val(response.admin.phoneNumber);
      $('#user-email').val(response.admin.email);
      $('#emergency-name').val(response.admin.emergencyContact.name);
      $('#emergency-phone').val(response.admin.emergencyContact.phone);
      $('#emergency-email').val(response.admin.emergencyContact.email);
      $('#emergency-relationship').val(response.admin.emergencyContact.relationship);

      // Notifications tab
      $('#email-reservations').prop('checked', response.admin.notifications.email.reminders)
      $('#email-promotion').prop('checked', response.admin.notifications.email.promotion)

      // Verifications
      function checkVerifications(type) {
        if (response.admin.verifications[type] === true) {
          $('#verification-'+type+' .collapsible-header').addClass('disabled');
          $('#verification-'+type+' .edit').html('<i class="fa fa-check-circle green-text fa-2x"></i>');
        }
      }
      ['email','phone','id'].forEach(checkVerifications);



    }.bind(this));

  },
  render: function() {

    return (

      <div></div>

    )
  }
});
