var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  render: function() {

    return (
      <div className='col s12'>
        Phone verification

        <div class='row section phone-request'>

          <div class='col s12 input-field center-align'>
            <a id='request-verification-sms' class='btn btn-secondary btn-flat'>Request verification SMS</a>
            <div id='please-add-a-phone' style='display:none' class='section no-margin-bottom'>
            </div>
          </div>

        </div>

        <div class='row section phone-verify' style='display:none'>

          <div class='col s12 m10 offset-m1 l10 offset-l1 red-text large'>
            <p>
              Please do not refresh this page. You should receive an SMS momentarily.
            </p>
          </div>

          <div class='col s12 m4 offset-m4 l4 offset-l4 input-field center-align'>
            <input id='sms-verification-code' type="text" class="validate" placeholder="{{translations.admin.verifications_phone_verification_code_placeholder}}" />
            <label class='active'>Verification code</label>
            <a id='verify-phone' class='btn btn-primary margin-top-20'>Verify</a>
          </div>

        </div>

      </div>
    );
  }
});
