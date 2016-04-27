const React = require('react');
const ReactDOM = require('react-dom');

const refreshToken = require('refresh-token');

const jwt_decode = require('jwt-decode');

const domains = require('domains');
const GET = require('GET');
const POST = require('POST');

const i18n = require('i18n');

var hidden = {
  display: 'none'
}

module.exports = React.createClass({
  goBack: function() {
    $('.make-sms-request').hide();
    $('.set-phone-number').show();
  },
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
      $('.phone-go-back').hide();
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

      $('#verifications-modal .status-bar .confirmation-sms-sent').hide();
      var refreshState = this.props.refreshState;
      refreshToken(function() {
        var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;
        if (JWT.cbk > 0) {
          refreshState();
        } else {
          $('#verifications-modal').closeModal();
          $('#preloader').show();

          var url = domains.API+'/users/'+JWT.rid+'/homes';
          var data = {};
          var success = function() {
            refreshToken(function() {
              window.location = '/manage-home'
            })
          }
          POST(url, data, success);
        }
      });
      $('#preloader').hide();


    }.bind(this)
    POST(url, verifyPhoneObj, success);

  },
  componentDidMount: function() {

    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/8.4.6/js/intlTelInput.min.js', function() {
      $('#phone-number-verifications-modal').intlTelInput({
        nationalMode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/8.4.6/js/utils.js"
      });

      $('#phone-number-verifications-modal').blur(function() {
        $(this).val($(this).intlTelInput("getNumber"))
        $(this).intlTelInput();
      })
    })

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

    var phoneNumber = this.props.phoneNumber !== null ? this.props.phoneNumber : '';

    return (
      <div className='col s12 verification-section'>

        <div className='row margin-top-20'>
          <h4 className='grey-text'>{i18n.t('common:phone_verification_title')}</h4>
        </div>

        <div className='row'>
          <div className='col s12'>
            <i className="fa fa-mobile fa-5x big-email-icon"></i>
          </div>
        </div>

        <div className='set-phone-number row'>
          <form onSubmit={this.props.changePhoneNumber}>
            <div className='col s12 m10 offset-m1 l6 offset-l3 input-field'>
              <input id='phone-number-verifications-modal' name='phone' maxlength='45' placeholder={i18n.t('common:whats_your_phone')} defaultValue={phoneNumber} type="tel" className="validate intl-tel-input" required='required' />
            </div>
            <div className='col s12 m10 offset-m1 l6 offset-l3 input-field'>
              <button className='btn btn-primary btn-flat margin-top-50'>{i18n.t('common:set_phone_number')}</button>
            </div>
          </form>
        </div>

        <div className='make-sms-request'>

          <div className='row phone-request no-margin-bottom'>
            <div className='col s12 input-field center-align'>
              <a id='request-verification-sms' className='btn btn-secondary btn-flat' onClick={this.requestVerificationSMS}>{i18n.t('common:request_verification_sms')}</a>
              <div id='please-add-a-phone' style='display:none' className='section no-margin-bottom'>
              </div>
            </div>
          </div>

          <div className='row phone-verify no-margin-bottom' style={hidden}>

            <div className='col s12 m4 offset-m4 l4 offset-l4 input-field center-align'>
              <input id='sms-verification-code-modal' type="text" className="validate" placeholder="Verification code" />
              <label className='active'>{i18n.t('common:verification_code')}</label>
              <a id='verify-phone' className='btn btn-primary margin-top-50' onClick={this.verifyPhone}>{i18n.t('common:verify')}</a>
            </div>

          </div>

          <div className='row phone-go-back'>
            <div className='col s12 grey-text'>
              <div className='large'>{i18n.t('common:your_phone_number_is')} {this.props.phoneNumber}</div>
              <div><a onClick={this.goBack}>{i18n.t('common:change_phone_number')}</a></div>
            </div>
          </div>

        </div>

      </div>
    );
  }
});
