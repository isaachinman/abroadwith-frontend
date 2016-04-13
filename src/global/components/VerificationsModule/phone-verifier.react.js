var React = require('react');
var ReactDOM = require('react-dom');

var refreshToken = require('refresh-token');

var jwt_decode = require('jwt-decode');

var domains = require('domains');
var GET = require('GET');
var POST = require('POST');

var i18n = require('i18n');

var hidden = {
  display: 'none'
}

module.exports = React.createClass({
  requestVerificationSMS: function() {

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $('#preloader').show();

    var url = domains.API + '/users/' + JWT.rid + '/verification/phone';
    var success = function(response) {

      $('#verifications-modal .status-bar .status').hide();
      $('#verifications-modal .status-bar .confirmation-sms-sent').show();

      console.log(response)

      var newState = {
        phoneSecret: response
      }

      this.setState(newState);

      $('.phone-request').hide();
      $('.phone-verify').show();

      $('#preloader').hide();

    }.bind(this);
    GET(url, success)

  },
  verifyPhone: function() {

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $('#preloader').show();

    var verifyPhoneObj = {
      secret: this.state.phoneSecret,
      key: this.props.phoneNumber,
      shortCode: parseInt($('#sms-verification-code-modal').val())
    }

    var url = domains.API + '/users/' + JWT.rid + '/verification/phone';
    var success = function(response) {

      refreshToken(this.props.refreshState);
      $('#preloader').hide();


    }.bind(this)
    POST(url, verifyPhoneObj, success);

  },
  componentDidUpdate: function() {

    if (this.props.phoneNumber) {
      $('.make-sms-request').show();
      $('.set-phone-number').hide();
    } else {
      $('.set-phone-number').show();
      $('.make-sms-request').hide();
    }

  },
  render: function() {

    console.log(this.props.phoneNumber)

    return (
      <div className='col s12 white border'>

        <h5 className='grey-text'>Phone verification</h5>

        <div className='set-phone-number row'>
          <form onSubmit={this.props.changePhoneNumber}>
            <div className='col s12 m10 offset-m1 l6 offset-l3 input-field'>
              <input id='phone-number-verifications-modal' name='phone' length='45' maxlength='45' placeholder="What's your phone number?" defaultValue={this.props.phoneNumber} type="tel" className="validate intl-tel-input" required='required' />
            </div>
            <div className='col s12 m10 offset-m1 l6 offset-l3 input-field'>
              <button className='btn btn-primary btn-flat'>Set phone number</button>
            </div>
          </form>
        </div>

        <div className='make-sms-request'>

          Your phone number is {this.props.phoneNumber}

          <div className='row section phone-request'>
            <div className='col s12 input-field center-align'>
              <a id='request-verification-sms' className='btn btn-secondary btn-flat' onClick={this.requestVerificationSMS}>Request verification SMS</a>
              <div id='please-add-a-phone' style='display:none' className='section no-margin-bottom'>
              </div>
            </div>
          </div>

          <div className='row section phone-verify' style={hidden}>
            <div className='col s12 m10 offset-m1 l10 offset-l1 red-text large'>
              <p>
                Please do not refresh this page. You should receive an SMS momentarily.
              </p>
            </div>

            <div className='col s12 m4 offset-m4 l4 offset-l4 input-field center-align'>
              <input id='sms-verification-code-modal' type="text" className="validate" placeholder="Verification code" />
              <label className='active'>Verification code</label>
              <a id='verify-phone' className='btn btn-primary margin-top-20' onClick={this.verifyPhone}>Verify</a>
            </div>
          </div>
        </div>

      </div>
    );
  }
});
