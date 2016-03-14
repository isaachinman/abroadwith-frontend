var React = require('react');
var ReactDOM = require('react-dom');

var domains = require('domains');
var jwt_decode = require('jwt-decode');

module.exports = React.createClass({
  requestVerificationEmail: function() {

    $('#preloader').show();

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
      url: domains.API + '/users/' + JWT.rid + '/verification/email',
      type: "GET",
      contentType: "application/json",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))
      },
      success: function(response) {

        $('#preloader').hide();
        Materialize.toast('Verification email sent', 4000);

      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })

  },
  requestVerificationSMS: function() {

    $('#preloader').show();

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
      url: domains.API + '/users/' + JWT.rid + '/verification/phone',
      type: "GET",
      contentType: "application/json",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))
      },
      success: function(response) {

        $('#preloader').hide();
        Materialize.toast('Verification SMS sent', 4000);

      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })

  },
  componentDidMount: function() {

    var requestVerificationEmail = this.requestVerificationEmail;
    $('a#request-verification-email').click(function() {
      requestVerificationEmail()
    });

    var requestVerificationSMS = this.requestVerificationSMS;
    $('a#request-verification-sms').click(function() {
      requestVerificationSMS()
    });


  },
  render: function() {
    return (
      <div></div>
    );
  }
});
