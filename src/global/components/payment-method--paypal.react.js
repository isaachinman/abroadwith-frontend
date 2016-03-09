var React = require('react');
var ReactDOM = require('react-dom');
var jwt_decode = require('jwt-decode');
var domains = require('domains');

module.exports = React.createClass({
  deletePaymentMethod: function() {

    $('#preloader').show();

    var deleteCallback = this.props.deleteCallback;

    // Generate clientToken
    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/paymentMethod/'+this.props.id,
      type: "DELETE",
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        deleteCallback(function() {
          null;
        });

      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })
  },
  render: function() {
    if (this.props.default === true) {
      var defaultHTML = <div className='default-payment-overlay'></div>;
      var defaultText = 'Default';
    } else {
      var defaultHTML = null;
      var defaultText = <a>Set as default</a>;
    }
    return (
      <div className='payment-method'>
        <div className='number'>
          {this.props.email}
        </div>
        <div className='secondary grey-text'>
          Connected
        </div>
        <div className='actions'>
          <a onClick={this.deletePaymentMethod}>Remove</a>
        </div>
        <div className='type'>
          <i className="fa fa-cc-paypal"></i>
        </div>
      </div>
    );
  }
});
