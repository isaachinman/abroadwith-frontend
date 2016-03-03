var React = require('react');
var domains = require('domains');
var jwt_decode = require('jwt-decode');
var sendPaymentNonce = require('send-payment-nonce');

module.exports = React.createClass({
  componentDidUpdate: function() {
  },
  componentDidMount: function() {

    $('ul.collapsible').collapsible({
      accordion : false
    });

    // Generate clientToken
    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/clientToken',
      type: "GET",
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

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
              sendPaymentNonce(obj.nonce)
              console.log(obj)
            },
            onReady: function() {

                $("#paypal-container").bind("DOMSubtreeModified", function() {
                  $('#add-new-paypal').removeClass('hide');
                });

            }
          })

        })

      }.bind(this),
      error: function() {

        alert('Something failed');

        // If clientToken GET fails, remove all UI to prevent people from typing sensitive data in unhosted fields
        $('#add-payment-form').remove();

      }
    })
  },
  render: function() {

    return (

        <form id="add-payment-form" className='card-reveal'>
          <div class='title'>Add payment method</div>
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

                  <div className='col s12'>
                    <input id='add-new-card' className='btn btn-flat btn-secondary' type="submit" value="Add card" />
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
                    <input id='add-new-paypal' className='btn btn-flat btn-secondary hide' type="submit" value="Add Paypal" />
                  </div>
                </div>

              </div>
            </li>
          </ul>


        </form>

    );
  }
});
