const React = require('react');
const ReactDOM = require('react-dom');

const refreshToken = require('refresh-token');

const i18n = require('../../global/util/i18n');
const toast = require('toast');

const JWT = require('JWT');
const GET = require('GET');
const POST = require('POST');

const domains = require('domains');

module.exports = React.createClass({
  requestVerificationEmail: function() {

    $('#preloader').show();

    var url = domains.API + '/users/' + JWT.rid + '/verification/email';
    var success = function() {

      $('#preloader').hide();
      toast(i18n.t('admin:verification_email_toast'));

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
      toast(i18n.t('admin:verification_sms_toast'));

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

      this.props.updateAdmin(function() {
        $('#verification-phone .collapsible-body').remove();

        refreshToken(function() {
          return;
        });

        $('#preloader').hide();
        toast(i18n.t('admin:phone_verified_toast'));
      });

    }.bind(this)
    POST(url, verifyPhoneObj, success);

  },
  componentDidMount: function() {

    // Request email verification
    $('a#request-verification-email').click(function() {
      this.requestVerificationEmail()
    }.bind(this));

  },
  componentDidUpdate: function() {

    // Request SMS verification
    if (this.props.phoneNumber !== null && typeof this.props.phoneNumber !== 'undefined') {
      $('a#request-verification-sms').removeClass('disabled');
      $('#please-add-a-phone').hide();
      $('a#verify-phone').off()
      $('a#verify-phone').click(function() {
        this.verifyPhone();
      }.bind(this))
      $('a#request-verification-sms').off();
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
