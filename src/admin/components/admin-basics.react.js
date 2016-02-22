var React = require('react');

module.exports = React.createClass({
  saveBasics: function() {

    adminObj.firstName =                        $('#firstName').val();
    adminObj.lastName =                         $('#lastName').val();
    adminObj.gender =                           $('#gender').val();
    adminObj.birthDate =                        $('#birthDate').val();
    adminObj.location =                         $('#location').val();
    adminObj.phoneNumber =                      $('#phoneNumber').val();
    adminObj.email =                            $('#user-email').val();
    adminObj.emergencyContact.name =            $('#emergency-name').val();
    adminObj.emergencyContact.phone =           $('#emergency-phone').val();
    adminObj.emergencyContact.email =           $('#emergency-email').val();
    adminObj.emergencyContact.relationship =    $('#emergency-relationship').val();

    this.props.updateAdmin();

  },
  componentDidMount: function() {
    $('a#save-basics').click(this.saveBasics)
  },
  componentDidUpdate: function() {
    // Basics tab
    $('#firstName').val(this.props.firstName);
    $('#lastName').val(this.props.lastName);
    $('#gender').val(this.props.gender);
    $('#birthDate').val(this.props.birthDate);
    $('#location').val(this.props.location);
    $('#phoneNumber').val(this.props.phoneNumber);
    $('#user-email').val(this.props.email);
    $('#emergency-name').val(this.props.emergencyName);
    $('#emergency-phone').val(this.props.emergencyPhone);
    $('#emergency-email').val(this.props.emergencyEmail);
    $('#emergency-relationship').val(this.props.emergencyRelationship);
  },
  render: function() {

    return (
      <div></div>
    );
  }
});
