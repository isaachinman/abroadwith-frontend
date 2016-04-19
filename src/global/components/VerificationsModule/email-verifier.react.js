const React = require('react');
const ReactDOM = require('react-dom');

const domains = require('domains');

const jwt_decode = require('jwt-decode');
const GET = require('GET');

module.exports = React.createClass({
  requestVerificationEmail: function() {

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $('#preloader').show();

    var url = domains.API + '/users/' + JWT.rid + '/verification/email';
    var success = function() {

      $('#preloader').hide();

      $('#verifications-modal .status-bar .status').hide();
      $('#verifications-modal .status-bar .confirmation-email-sent').show();

    };
    GET(url, success)

  },
  render: function() {

    return (
      <div className='col s12 verification-section'>

        <div className='row margin-top-20'>
          <h4 className='grey-text'>Email verification</h4>
        </div>

        <div className='row'>
          <div className='col s12'>
            <i className="fa fa-envelope-o fa-5x big-email-icon"></i>
          </div>
        </div>

        <div className='row section'>
          <div className='col s12'>
            <a id='request-verification-email' class='btn btn-secondary btn-flat' onClick={this.requestVerificationEmail}>Resend confimation email</a>
          </div>
        </div>

        <div className='row'>
          <div className='col s12 grey-text'>
            <div className='large'>Your email is {this.props.email}</div>
          </div>
        </div>

      </div>
    );
  }
});
