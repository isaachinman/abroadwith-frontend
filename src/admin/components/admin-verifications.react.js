var React = require('react');
var ReactDOM = require('react-dom');

var JWT = require('JWT');
var GET = require('GET');
var POST = require('POST');

var domains = require('domains');

module.exports = React.createClass({
  requestVerificationEmail: function() {

    $('#preloader').show();

    var url = domains.API + '/users/' + JWT.rid + '/verification/email';
    var success = function() {

      $('#preloader').hide();
      Materialize.toast('Verification email sent', 4000);

    };
    GET(url, success)

  },
  requestVerificationSMS: function() {

    $('#preloader').show();

    var url = domains.API + '/users/' + JWT.rid + '/verification/phone';
    var success = function(response) {

      var newState = {
        phoneSecret: response
      }

      this.setState(newState);

      $('.phone-request').hide();
      $('.phone-verify').show();

      $('#preloader').hide();
      Materialize.toast('Verification SMS sent', 4000);

    }.bind(this);
    GET(url, success)

  },
  verifyPhone: function() {

    $('#preloader').show();

    var updateAdmin = this.props.updateAdmin;

    var verifyPhoneObj = {
      secret: this.state.phoneSecret,
      key: this.props.phoneNumber,
      shortCode: parseInt($('#sms-verification-code').val())
    }

    console.log(verifyPhoneObj)

    var url = domains.API + '/users/' + JWT.rid + '/verification/phone';
    var success = function(response) {

      console.log(response);

      updateAdmin();

      $('#verification-phone .collapsible-body').remove();

      $('#preloader').hide();
      Materialize.toast('Phone verified', 4000);

    }
    POST(url, verifyPhoneObj, success);

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
