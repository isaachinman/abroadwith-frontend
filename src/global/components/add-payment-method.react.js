const React = require('react');
const ReactDOM = require('react-dom');

const JWT = require('JWT');
const GET = require('GET');

const domains = require('domains');

const sendPaymentNonce = require('send-payment-nonce');

const i18n = require('i18n');

module.exports = React.createClass({
  showPreloader: function() {
    $('#preloader').show()
  },
  componentDidMount: function() {

    var callback = this.props.callback;

    var url = domains.API+'/users/'+JWT.rid+'/clientToken';
    var success = function(response) {

      var clientToken = response;

      if (window.braintreeRan !== true) {

        $.getScript('https://js.braintreegateway.com/v2/braintree.js', function() {

          window.braintreeRan = true;

          // Setup braintree form
          braintree.setup(clientToken, 'custom', {
            id: 'add-payment-form',
            hostedFields: {
              number: {
                selector: "#card-number",
                placeholder: i18n.t("common:card_number_placeholder")
              },
              cvv: {
                selector: "#cvv",
                placeholder: i18n.t("common:cvv_placeholder")
              },
              expirationDate: {
                selector: "#expiration-date",
                placeholder: i18n.t("common:expiration_placeholder")
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
                $('#add-payment-method').remove();
              });
            },
            onError: function(error) {
              $('#preloader').hide();
              alert(error.message);
            },
            onReady: function(integration) {

              window.braintreeIntegration = integration;

              $('#add-payment-form ul.collapsible').collapsible();
              $('#braintree-preloader').hide();

              $("#paypal-container").bind("DOMSubtreeModified", function() {
                $('#add-new-paypal').removeClass('hide');
              });
            }
          })
        })
      }
    };
    GET(url, success)

  },
  componentWillUnmount: function() {
    typeof braintreeIntegration !== 'undefined' ? braintreeIntegration.teardown() : null;
    window.braintreeRan = false;
  },
  render: function() {

    return (

        <form id="add-payment-form" className='center-align relative'>

          <div id='braintree-preloader' className='preloader-container preloader-container--absolute'>
            <div className="preloader-wrapper big active">
              <div className="spinner-layer spinner-blue-only">
                <div className="circle-clipper left">
                  <div className="circle"></div>
                </div>
                <div className="gap-patch">
                  <div className="circle"></div>
                </div>
                <div className="circle-clipper right">
                  <div className="circle"></div>
                </div>
              </div>
            </div>
          </div>

          <div className='title'>{i18n.t("common:Add_payment_method")}</div>
          <ul className="collapsible" data-collapsible="accordion">
            <li>
              <div className="collapsible-header">{i18n.t("common:Credit_card")}</div>
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
                    <input id='add-new-card' className='btn btn-flat btn-primary' type="submit" value={i18n.t('common:add_card_button')} onClick={this.showPreloader} />
                  </div>
                </div>

              </div>
            </li>
            <li>
              <div className="collapsible-header">{i18n.t("common:PayPal")}</div>
              <div className="collapsible-body">

                <div id='paypal-container' className='row no-margin-bottom section center-align'></div>

                <div className='row'>
                  <div className='col s12'>
                    <input id='add-new-paypal' className='btn btn-flat btn-primary hide' type="submit" value={i18n.t('common:add_paypal_button')} onClick={this.showPreloader} />
                  </div>
                </div>

              </div>
            </li>
          </ul>

        </form>

    );
  }
});
