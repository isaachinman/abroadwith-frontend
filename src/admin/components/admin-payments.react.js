var React = require('react');
var ReactDOM = require('react-dom');
var CreditCard = require('../../global/components/payment-method--credit-card.react');
var Paypal = require('../../global/components/payment-method--paypal.react');
var AddPaymentMethod = require('../../global/components/add-payment-method.react');
var Bank = require('../../global/components/payment-method--bank.react');
var AddPayoutMethod = require('../../global/components/add-payout-method.react')

module.exports = React.createClass({
  componentDidUpdate: function() {

    var paymentMethodHTML = [];

    if (typeof this.props.paymentMethods !== 'undefined' && this.props.paymentMethods.length > 0) {

      var paymentMethods = this.props.paymentMethods;

      console.log(paymentMethods)

      var PaymentMethodContainer = React.createClass({
        render: function() {
          var paymentMethodHTML = []
          paymentMethods.forEach(function(payment) {
            console.log(payment)
            if (payment.type === 'CARD') {
              paymentMethodHTML.push(
                <div className='col s12 m6 l4'>
                  <CreditCard
                    default={payment.default}
                    expiry={payment.expiry}
                    lastFour={payment.lastFour}
                    cardHolder={payment.cardHolder}
                  />
                </div>
              )
            } else if (payment.type === 'PAYPAL') {
              paymentMethodHTML.push(
                <div className='col s12 m6 l4'>
                  <Paypal
                    default={payment.default}
                    email={payment.email}
                  />
                </div>
              )
            }
          })
          paymentMethodHTML.push(
            <div className='col s12 m6 l4'>
              <AddPaymentMethod />
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
              <AddPaymentMethod />
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

    if (typeof this.props.payoutMethods !== 'undefined' && this.props.payoutMethods.length > 0) {

      $('.payouts').removeClass('hide');

      var payoutMethods = this.props.payoutMethods;

      var PayoutMethodContainer = React.createClass({
        render: function() {
          var payoutHTML = []
          payoutMethods.forEach(function(payment) {
            if (payment.type === 'BANK') {
              payoutHTML.push(
                <Bank
                  default={payment.default}
                  lastFour={payment.lastFour}
                />
              )
            } else if (payment.type === 'PAYPAL') {
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


  },
  render: function() {
    return (
      <div></div>
    );
  }
});
