var React = require('react');
var ReactDOM = require('react-dom');

var toast = require('toast');

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
      toast('Verification email sent', 4000);

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
      toast('Verification SMS sent', 4000);

    }.bind(this);
    GET(url, success)

  },
  verifyPhone: function() {

    $('#preloader').show();

    var verifyPhoneObj = {
      secret: this.state.phoneSecret,
      key: this.props.phoneNumber,
      shortCode: parseInt($('#sms-verification-code').val())
    }

    var url = domains.API + '/users/' + JWT.rid + '/verification/phone';
    var success = function(response) {

      console.log(response);

      this.props.updateAdmin(function() {
        $('#verification-phone .collapsible-body').remove();
        $('#preloader').hide();
        toast('Phone verified', 4000);
      });



    }.bind(this)
    POST(url, verifyPhoneObj, success);

  },
  componentDidMount: function() {

    // Request email verification
    $('a#request-verification-email').click(function() {
      this.requestVerificationEmail()
    }.bind(this));

    // Request SMS verification
    if (this.props.phoneNumber !== null) {
      $('a#request-verification-sms').removeClass('disabled');
      $('#please-add-a-phone').hide();
      $('a#verify-phone').click(function() {
        this.verifyPhone();
      }.bind(this))
      $('a#request-verification-sms').click(function() {
        this.requestVerificationSMS()
      }.bind(this));
    } else {
      $('a#request-verification-sms').addClass('disabled');
      $('#please-add-a-phone').show();
    }

  },
  componentWillUnmount: function() {
    $('#verifications a').each(function() {
      $(this).off();
    });
  },
  render: function() {
    return (
      <div></div>
    );
  }
});
