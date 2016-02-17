var React = require('react');
var ReactDOM = require('react-dom');
var CreditCard = require('../../global/components/payment-method--credit-card.react');
var Paypal = require('../../global/components/payment-method--paypal.react');
var AddPaymentMethod = require('../../global/components/add-payment-method.react');
var Bank = require('../../global/components/payment-method--bank.react');
var AddPayoutMethod = require('../../global/components/add-payout-method.react')

module.exports = React.createClass({
  render: function() {

    var paymentMethodHTML = [];

    if (this.props.paymentMethods) {

      var paymentMethods = this.props.paymentMethods;

      var PaymentMethodContainer = React.createClass({
        render: function() {
          var paymentMethodHTML = []
          paymentMethods.forEach(function(payment) {
            if (payment.type === 'card') {
              paymentMethodHTML.push(
                <CreditCard
                  default={payment.default}
                  expiry={payment.expiry}
                  lastFour={payment.lastFour}
                  cardHolder={payment.cardHolder}
                />
              )
            } else if (payment.type === 'paypal') {
              paymentMethodHTML.push(
                <Paypal
                  default={payment.default}
                  email={payment.email}
                />
              )
            }
          })
          paymentMethodHTML.push(
            <AddPaymentMethod />
          )
          return (
            <div>{paymentMethodHTML}</div>
          )
        }
      })

      ReactDOM.render(
        <PaymentMethodContainer
        />, document.querySelector('#existing-payment-methods')
      )

    }

    if (this.props.payoutMethods) {

      $('.payouts').removeClass('hide');

      var payoutMethods = this.props.payoutMethods;

      var PayoutMethodContainer = React.createClass({
        render: function() {
          var payoutHTML = []
          payoutMethods.forEach(function(payment) {
            if (payment.type === 'bank') {
              payoutHTML.push(
                <Bank
                  default={payment.default}
                  lastFour={payment.lastFour}
                />
              )
            } else if (payment.type === 'paypal') {
              payoutHTML.push(
                <Paypal
                  default={payment.default}
                  email={payment.email}
                />
              )
            }
          })
          payoutHTML.push(
            // Add payout method
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

    return (
      <div></div>
    );
  }
});
