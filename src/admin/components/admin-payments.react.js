var React = require('react');
var ReactDOM = require('react-dom');
var CreditCard = require('../../global/components/payment-method--credit-card.react');
var Paypal = require('../../global/components/payment-method--paypal.react');
var AddPaymentMethod = require('../../global/components/add-payment-method.react');
var Bank = require('../../global/components/payout-method--bank.react');
var PaypalPayout = require('../../global/components/payout-method--paypal.react');
var AddPayoutMethod = require('../../global/components/add-payout-method.react');

var domains = require('domains');
var JWT = require('JWT');
var POST = require('POST');
var DELETE = require('DELETE');

module.exports = React.createClass({
  deletePaymentMethod: function(id) {

    $('#preloader').show();

    var url = domains.API + '/users/' + JWT.rid + '/paymentMethods/' + id;
    var deletePaymentSuccess = function(response) {
      $('#preloader').hide();
      this.props.updateAdmin();
    }.bind(this)
    DELETE(url, deletePaymentSuccess);

  },
  deletePayoutMethod: function(id) {

    $('#preloader').show();

    var url = domains.API + '/users/' + JWT.rid + '/payoutMethods/' + id;
    var deletePayoutSuccess = function(response) {
      $('#preloader').hide();
      this.props.updateAdmin();
    }.bind(this)
    DELETE(url, deletePayoutSuccess);

  },
  setPayoutMethodDefault: function(id) {

    $('#preloader').show();

    var url = domains.API + '/users/' + JWT.rid + '/payoutMethods/' + id;
    var success = function() {
      $('#preloader').hide();
      this.props.updateAdmin();
    }.bind(this)
    POST(url, {}, success);

  },
  componentDidUpdate: function() {

    var updateAdmin = this.props.updateAdmin;
    var deletePaymentMethod = this.deletePaymentMethod;
    var deletePayoutMethod = this.deletePayoutMethod;
    var setPayoutMethodDefault = this.setPayoutMethodDefault;

    var paymentMethodHTML = [];

    if (typeof this.props.paymentMethods !== 'undefined' && this.props.paymentMethods.length > 0) {

      var paymentMethods = this.props.paymentMethods;

      var PaymentMethodContainer = React.createClass({
        render: function() {
          var paymentMethodHTML = []
          paymentMethods.forEach(function(payment) {
            console.log(payment)
            if (payment.type === 'CARD') {
              paymentMethodHTML.push(
                <div className='col s12 m6 l4'>
                  <CreditCard
                    id={payment.id}
                    default={payment.default}
                    expiry={payment.expiry}
                    lastFour={payment.lastFour}
                    cardHolder={payment.cardHolder}
                    deletePaymentMethod={function() { deletePaymentMethod(payment.id) } }
                  />
                </div>
              )
            } else if (payment.type === 'PAYPAL') {
              paymentMethodHTML.push(
                <div className='col s12 m6 l4'>
                  <Paypal
                    id={payment.id}
                    default={payment.default}
                    email={payment.email}
                    deletePaymentMethod={function() { deletePaymentMethod(payment.id) } }
                  />
                </div>
              )
            }
          })
          paymentMethodHTML.push(
            <div className='col s12 m6 l4'>
              <AddPaymentMethod
                callback={updateAdmin.bind(this)}
              />
            </div>
          )
          return (
            <div>{paymentMethodHTML}</div>
          )
        }
      })

    } else {

      var PaymentMethodContainer = React.createClass({
        render: function() {
          var paymentMethodHTML = []
          paymentMethodHTML.push(
            <div className='col s12 m6 l4'>
              <AddPaymentMethod
                callback={updateAdmin}
              />
            </div>
          )
          return (
            <div>{paymentMethodHTML}</div>
          )
        }
      })
    }

    // Render payment method UI
    ReactDOM.render(
      <PaymentMethodContainer
      />, document.querySelector('#existing-payment-methods')
    )

    if (JWT.hid) {

      $('.payouts').removeClass('hide');

      var payoutMethods = this.props.payoutMethods.sort(function(a,b){return b.isDefault-a.isDefault});

      console.log(this.props.payoutMethods)

      var PayoutMethodContainer = React.createClass({
        render: function() {
          var payoutHTML = []
          payoutMethods.forEach(function(payment) {
            if (payment.type === 'BANK') {
              payoutHTML.push(
                <div className='col s12 m6 l4'>
                  <Bank
                    id={payment.id}
                    default={payment.isDefault}
                    lastFour={payment.ibanCode}
                    setPayoutMethodDefault={function() { setPayoutMethodDefault(payment.id) } }
                    deletePayoutMethod={function() { deletePayoutMethod(payment.id) } }
                  />
                </div>
              )
            } else if (payment.type === 'ROUTING_TRANSIT') {
              payoutHTML.push(
                <div className='col s12 m6 l4'>
                  <Bank
                    id={payment.id}
                    default={payment.isDefault}
                    lastFour={payment.routingAccountNumber}
                    setPayoutMethodDefault={function() { setPayoutMethodDefault(payment.id) } }
                    deletePayoutMethod={function() { deletePayoutMethod(payment.id) } }
                  />
                </div>
              )
            } else if (payment.type === 'PAYPAL') {
              payoutHTML.push(
                <div className='col s12 m6 l4'>
                  <PaypalPayout
                    id={payment.id}
                    default={payment.isDefault}
                    email={payment.email}
                    setPayoutMethodDefault={function() { setPayoutMethodDefault(payment.id) } }
                    deletePayoutMethod={function() { deletePayoutMethod(payment.id) } }
                  />
                </div>
              )
            }
          })
          payoutHTML.push(
            <div className='col s12 m6 l4'>
              <AddPayoutMethod
                updateAdmin={updateAdmin.bind(this)}
              />
            </div>
          )
          return (
            <div>{payoutHTML}</div>
          )
        }
      })

      ReactDOM.render(
        <PayoutMethodContainer
        />, document.querySelector('#existing-payout-methods')
      )

    }

  },
  render: function() {
    return (
      <div></div>
    );
  }
});
