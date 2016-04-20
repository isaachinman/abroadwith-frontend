const React = require('react');
const ReactDOM = require('react-dom');

const domains = require('domains');
const jwt_decode = require('jwt-decode');

const GET = require('GET');
const POST = require('POST');

const EmailVerifier = require('./email-verifier.react');
const PhoneVerifier = require('./phone-verifier.react');

module.exports = React.createClass({
  getInitialState: function() {

    this.refreshState();

  },
  refreshState: function(callback) {
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

      if (typeof callback !== undefined && $.isFunction(callback)) {
        callback();
      }

    }.bind(this)
    GET(url, success);
  },
  changePhoneNumber: function(e) {

    $('#preloader').show()

    e.preventDefault();

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    if ($('#phone-number-verifications-modal').intlTelInput('isValidNumber')) {

      var url = domains.API + '/users/' + JWT.rid;
      userObj.phoneNumber = $('#phone-number-verifications-modal').val();
      var success = function(response) {
        console.log(response);
        this.refreshState(function() {
          $('#preloader').hide();
        })
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
