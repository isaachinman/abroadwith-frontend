var React = require('react');
var ReactDOM = require('react-dom');
var CreditCard = require('../../global/components/payment-method--credit-card.react');
var Paypal = require('../../global/components/payment-method--paypal.react');
var AddPaymentMethod = require('../../global/components/add-payment-method.react');

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

    return (
      <div></div>
    );
  }
});
