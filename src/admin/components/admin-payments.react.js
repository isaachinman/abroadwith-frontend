var React = require('react');
var ReactDOM = require('react-dom');
var CreditCard = require('../../global/components/payment-method--credit-card.react');
var Paypal = require('../../global/components/payment-method--paypal.react');
var AddPaymentMethod = require('../../global/components/add-payment-method.react');
var Bank = require('../../global/components/payout-method--bank.react');
var PaypalPayout = require('../../global/components/payout-method--paypal.react');
var AddPayoutMethod = require('../../global/components/add-payout-method.react');

var JWT = require('JWT');

module.exports = React.createClass({
  componentDidUpdate: function() {

    var updateAdmin = this.props.updateAdmin;

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
                    deleteCallback={updateAdmin.bind(this)}
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
                    deleteCallback={updateAdmin.bind(this)}
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

      var payoutMethods = this.props.payoutMethods;

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
                    deleteCallback={updateAdmin}
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
                    deleteCallback={updateAdmin}
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
                    deleteCallback={updateAdmin}
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
