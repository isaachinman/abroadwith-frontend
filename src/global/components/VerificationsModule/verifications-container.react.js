var React = require('react');
var ReactDOM = require('react-dom');

var domains = require('domains');
var jwt_decode = require('jwt-decode');

var GET = require('GET');
var POST = require('POST');

var EmailVerifier = require('./email-verifier.react');
var PhoneVerifier = require('./phone-verifier.react');

module.exports = React.createClass({
  getInitialState: function() {

    this.refreshState();

  },
  refreshState: function() {
    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;
    var url = domains.API + '/users/' + JWT.rid;
    var success = function(response) {

      window.userObj = response;
      delete userObj.paymentMethods;
      delete userObj.payoutMethods;
      delete userObj.verifications;
      delete userObj.email;

      this.setState({
        phoneNumber: response.phoneNumber,
        email: JWT.email
      })
    }.bind(this)
    GET(url, success);
  },
  changePhoneNumber: function(e) {

    e.preventDefault();

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    if ($('#phone-number-verifications-modal').intlTelInput('isValidNumber')) {

      var url = domains.API + '/users/' + JWT.rid;
      userObj.phoneNumber = $('#phone-number-verifications-modal').val();
      var success = function(response) {
        console.log(response);
        this.refreshState();
      }.bind(this)
      POST(url, userObj, success)

    }

  },
  render: function() {

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    var verificationNeeded = [];

    if (JWT.cbk === 1) {
      verificationNeeded.push(
        <EmailVerifier
          email={this.state.email}
        />
      )
    } else if (JWT.cbk === 2 || JWT.cbk === 3) {
      verificationNeeded.push(
        <PhoneVerifier
          refreshState={this.refreshState}
          phoneNumber={this.state.phoneNumber}
          changePhoneNumber={this.changePhoneNumber}
        />
      )
    }

    return (
      <div className='row full'>
        {verificationNeeded}
      </div>
    );
  }
});
