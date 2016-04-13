var React = require('react');
var ReactDOM = require('react-dom');

var jwt_decode = require('jwt-decode');

var EmailVerifier = require('./email-verifier.react');
var PhoneVerifier = require('./phone-verifier.react');

module.exports = React.createClass({
  render: function() {

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    var verificationsNeeded = [];

    if (JWT.cbk === 1) {
      verificationsNeeded.push(
        <EmailVerifier />
      )
    } else if (JWT.cbk === 2) {
      verificationsNeeded.push(
        <PhoneVerifier />
      )
    } else if (JWT.cbk === 3) {
      verificationsNeeded.push(
        <EmailVerifier />
      )
      verificationsNeeded.push(
        <PhoneVerifier />
      )
    }

    return (
      <div className='row'>
        {verificationsNeeded}
      </div>
    );
  }
});
