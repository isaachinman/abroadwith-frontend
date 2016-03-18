var React = require('react');
var ReactDOM = require('react-dom');

var domains = require('domains');
var JWT = require('JWT');
var POST = require('POST');

module.exports = React.createClass({
  deletePayoutMethod: function() {

    $('#preloader').show();

    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/payoutMethods/'+this.props.id,
      type: "DELETE",
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        this.props.deleteCallback();

      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })
  },
  setPayoutMethodDefault: function() {

    $('#preloader').show();

    var url = domains.API + '/users/' + JWT.rid + '/payoutMethods/' + this.props.id;
    var success = function() {
      $('#preloader').hide();
      this.props.deleteCallback();
    }.bind(this)
    POST(url, adminObj, success);

  },
  render: function() {
    if (this.props.default === true) {
      var defaultHTML = <div className='default-payment-overlay'></div>;
      var defaultText = <span className="grey-text text-darken-1">Default</span>;
    } else {
      var defaultHTML = null;
      var defaultText = <a onClick={this.setPayoutMethodDefault}>Set as default</a>;
    }
    return (
      <div className='payment-method'>
        {defaultHTML}
        <div className='number'>
          {this.props.email}
        </div>
        <div className='secondary grey-text'>
          Connected
        </div>
        <div className='actions'>
          {defaultText}
          <a onClick={this.deletePayoutMethod}>Remove</a>
        </div>
        <div className='type'>
          <i className="fa fa-cc-paypal"></i>
        </div>
      </div>
    );
  }
});
