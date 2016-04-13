var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  render: function() {

    return (
      <div className='col s12'>

        Email verification

        <a id='request-verification-email' class='btn btn-secondary btn-flat'>Resend confimation email</a>

      </div>
    );
  }
});
