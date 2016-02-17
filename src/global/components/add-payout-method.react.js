var React = require('react');
require('iban')

module.exports = React.createClass({
  componentDidUpdate: function() {
  },
  componentDidMount: function() {

    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

    // Temporary client token for testing
    var clientToken = $('#client-token').attr('data-token');

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
          singleUse: false,
          onPaymentMethodReceived: function (obj) {
            console.log(obj)
          }
        },
        dataCollector: {
          paypal: true
        },
        onPaymentMethodReceived: function (obj) {
          console.log(obj)
        },
        onReady: function() {

            $("#paypal-container").bind("DOMSubtreeModified", function() {
              $('#add-new-paypal').removeClass('hide');
            });

        }
      })

    })
  },
  render: function() {

    return (
      <div className='col s12 m6 l4'>
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
      </div>
    );
  }
});
