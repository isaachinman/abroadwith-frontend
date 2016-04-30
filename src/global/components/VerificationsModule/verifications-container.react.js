const React = require('react')
const ReactDOM = require('react-dom')

const intlTelInput = require('intl-tel-input')

const domains = require('domains');
const jwt_decode = require('jwt-decode')
const refreshToken = require('refresh-token')

const GET = require('GET');
const POST = require('POST');

const EmailVerifier = require('./email-verifier.react')
const PhoneVerifier = require('./phone-verifier.react')

module.exports = React.createClass({
  getInitialState: function() {

    this.refreshState();

  },
  componentDidMount: function() {
    var refreshState = this.refreshState;
    $('a.your-home').click(function() {
      console.log('refreshing')
      refreshState()
    })
  },
  refreshState: function(callback) {

    $('#verifications-preloader').show()

    refreshToken(function() {

      var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;
      var url = domains.API + '/users/' + JWT.rid;
      var success = function(response) {

        delete response.paymentMethods;
        delete response.payoutMethods;
        delete response.verifications;
        delete response.email;

        this.setState({
          phoneNumber: response.phoneNumber,
          email: JWT.email,
          userVerificationObj: response
        })

        if (typeof callback !== undefined && $.isFunction(callback)) {
          callback();
        }

        $('#verifications-preloader').hide()

      }.bind(this)
      GET(url, success);

    }.bind(this))

  },
  changePhoneNumber: function(e) {

    $('#preloader').show()

    e.preventDefault();

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    if ($('#phone-number-verifications-modal').intlTelInput('isValidNumber')) {

      var userVerificationObj = this.state.userVerificationObj

      var url = domains.API + '/users/' + JWT.rid;
      userVerificationObj.phoneNumber = $('#phone-number-verifications-modal').intlTelInput('getNumber');
      console.log(userVerificationObj)

      var success = function(response) {
        console.log(response);
        $('#preloader').hide();
        this.refreshState(function() {
          return
        })
      }.bind(this)
      POST(url, userVerificationObj, success)

    } else {
      $('#preloader').hide()
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
        <div id='verifications-preloader' className='preloader-container' style='display:none'>
          <div className="preloader-wrapper big active">
            <div className="spinner-layer spinner-blue-only">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
                <div className="circle"></div>
              </div><div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
