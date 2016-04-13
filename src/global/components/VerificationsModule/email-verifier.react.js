var React = require('react');
var ReactDOM = require('react-dom');

var domains = require('domains');

var jwt_decode = require('jwt-decode');
var GET = require('GET');

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
      <div className='col s12'>

        Your email is: {this.props.email}

        <br />

        Email verification

        <a id='request-verification-email' class='btn btn-secondary btn-flat' onClick={this.requestVerificationEmail}>Resend confimation email</a>

      </div>
    );
  }
});
