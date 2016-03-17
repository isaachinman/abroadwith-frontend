var React = require('react');

var domains = require('domains');
var JWT = require('JWT');

module.exports = React.createClass({
  deletePayoutMethod: function() {

    $('#preloader').show();

    var deleteCallback = this.props.deleteCallback;

    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/payoutMethods/'+this.props.id,
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
      var defaultText = <span className="grey-text text-darken-1">Default</span>;
    } else {
      var defaultHTML = null;
      var defaultText = <a>Set as default</a>;
    }
    return (
      <div className='payment-method'>
        {defaultHTML}
        <div className='number'>
          <span className='grey-text'>XXXXXXXXXXXX</span><span className='grey-text text-darken-1'>{this.props.lastFour}</span>
        </div>
        <div className='secondary grey-text'>
          Bank account
        </div>
        <div className='actions'>
          {defaultText}
          <a onClick={this.deletePayoutMethod}>Remove</a>
        </div>
        <div className='type'>
          <i className="fa fa-university"></i>
        </div>
      </div>
    );
  }
});
