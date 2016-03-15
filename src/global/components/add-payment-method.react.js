var React = require('react');
var ReactDOM = require('react-dom');

var JWT = require('JWT');
var GET = require('GET');

var domains = require('domains');

var sendPaymentNonce = require('send-payment-nonce');

module.exports = React.createClass({
  showPreloader: function() {
    $('#preloader').show()
  },
  componentDidMount: function() {

    var callback = this.props.callback;

    var url = domains.API+'/users/'+JWT.rid+'/clientToken';
    var success = function(response) {

      var clientToken = response;

      $.getScript('https://js.braintreegateway.com/v2/braintree.js', function() {

        console.log('braintree ran')

        // Setup braintree form
        braintree.setup(clientToken, 'custom', {
          id: 'add-payment-form',
          hostedFields: {
            number: {
              selector: "#card-number",
              placeholder: 'Card number'
            },
            cvv: {
              selector: "#cvv",
              placeholder: 'CVV'
            },
            expirationDate: {
              selector: "#expiration-date",
              placeholder: 'Expiry'
            },
            styles: {
              "input": {
                "font-size":"1rem",
                "color":"#3A3A3A",
                "font-family":"Open Sans, sans serif"
              }
            }
          },
          paypal: {
            container: 'paypal-container',
            singleUse: false
          },
          dataCollector: {
            paypal: true
          },
          onPaymentMethodReceived: function (obj) {
            sendPaymentNonce(obj.nonce, function() {
              callback();
            });
          },
          onReady: function() {

            $('#add-payment-form ul.collapsible').collapsible();

            $("#paypal-container").bind("DOMSubtreeModified", function() {
              $('#add-new-paypal').removeClass('hide');
            });

          }
        })

      })

    };
    GET(url, success)

  },
  render: function() {

    return (

        <form id="add-payment-form" className='center-align'>
          <div className='title'>Add payment method</div>
          <ul className="collapsible" data-collapsible="accordion">
            <li>
              <div className="collapsible-header">Credit card</div>
              <div className="collapsible-body">
                <div className='row'>

                  <div className='col s12'>

                    <div className='input-field'>
                      <div id="card-number" className='braintree-input'></div>
                    </div>
                  </div>

                  <div className='col s6'>
                    <div className='input-field'>
                      <div id="cvv" className='braintree-input'></div>
                    </div>
                  </div>

                  <div className='col s6'>
                    <div className='input-field'>
                      <div id="expiration-date" className='braintree-input'></div>
                    </div>
                  </div>

                </div>

                <div className='row'>
                  <div className='col s12'>
                    <input id='add-new-card' className='btn btn-flat btn-primary' type="submit" value="Add card" onClick={this.showPreloader} />
                  </div>
                </div>

              </div>
            </li>
            <li>
              <div className="collapsible-header">Paypal</div>
              <div className="collapsible-body">

                <div id='paypal-container' className='row no-margin-bottom section center-align'></div>

                <div className='row'>
                  <div className='col s12'>
                    <input id='add-new-paypal' className='btn btn-flat btn-primary hide' type="submit" value="Add Paypal" onClick={this.showPreloader} />
                  </div>
                </div>

              </div>
            </li>
          </ul>

        </form>

    );
  }
});
