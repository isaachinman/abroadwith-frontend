var React = require('react');
var ReactDOM = require('react-dom');

var domains = require('domains');
var jwt_decode = require('jwt-decode');

module.exports = React.createClass({
  requestVerificationEmail: function() {

    $('#preloader').show();

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
      url: domains.API + '/users/' + JWT.rid + '/verification/email',
      type: "GET",
      contentType: "application/json",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))
      },
      success: function(response) {

        $('#preloader').hide();
        Materialize.toast('Verification email sent', 4000);

      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })

  },
  requestVerificationSMS: function() {

    $('#preloader').show();

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
      url: domains.API + '/users/' + JWT.rid + '/verification/phone',
      type: "GET",
      contentType: "application/json",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))
      },
      success: function(phoneSecret) {

        var newState = {
          phoneSecret: phoneSecret
        }

        if (this.isMounted()) {
          this.setState(newState);
          console.log(this.state)
        }

        $('#preloader').hide();
        Materialize.toast('Verification SMS sent', 4000);

      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })

  },
  verifyPhone: function() {

    $('#preloader').show();

    var verifyPhoneObj = {
      secret: this.state.phoneSecret,
      key: this.props.phoneNumber,
      shortCode: parseInt($('#sms-verification-code').val())
    }

    console.log(verifyPhoneObj)

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
      url: domains.API + '/users/' + JWT.rid + '/verification/phone',
      type: "POST",
      data: JSON.stringify(verifyPhoneObj),
      contentType: "application/json",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))
      },
      success: function(response) {

        console.log(response)
        $('#preloader').hide();
        Materialize.toast('Phone verified', 4000);

      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })

  },
  componentDidMount: function() {

    var requestVerificationEmail = this.requestVerificationEmail;
    $('a#request-verification-email').click(function() {
      requestVerificationEmail()
    });

    var requestVerificationSMS = this.requestVerificationSMS;
    $('a#request-verification-sms').click(function() {
      requestVerificationSMS()
    });

    var verifyPhone = this.verifyPhone;
    $('a#verify-phone').click(function() {
      verifyPhone();
    })


  },
  render: function() {
    return (
      <div></div>
    );
  }
});
