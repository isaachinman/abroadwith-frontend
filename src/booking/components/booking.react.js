var React = require('react');
var ReactDOM = require('react-dom');

var AddPaymentMethod = require('../../global/components/add-payment-method.react');
var Paypal = require('../../global/components/payment-method--paypal.react');
var Bank = require('../../global/components/payment-method--bank.react');

var domains = require('domains');
var jwt_decode = require('jwt-decode');

require('../scrollspy');
$('.scrollspy').scrollSpy();

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['booking']);

var domains = require('domains');
var jwt_decode = require('jwt-decode');

module.exports = React.createClass({
  requestBooking: function() {

  },
  calculateNewPrice: function() {

  },
  refreshState: function() {

    // Find teaching languages
    var languageHostWillTeach = $('#'+$('#booking-immersions').val()+'-learning').val();
    var languageGuestWillTeach = $('#booking-immersions').val() === 'tandem' ?  $('#tandem-teaching').val() : null;

    // Generate services array
    var serviceNames = [];
    $('input.booking-service').each(function() {
      if ($(this).is(':checked')) {
        serviceNames.push($(this).attr('data-value'));
      }
    })

    var newState = {
      // Conditionally set up state per category
      arrivalDate:                $('#arrival').attr('data-value'),
      departureDate:              $('#departure').attr('data-value'),
      roomId:                 $('#room_id').attr('data-value'),
      guestCount:             $('#guests').attr('data-value'),
      languageHostWillTeach:  languageHostWillTeach,
      languageGuestWillTeach: languageGuestWillTeach,
      currency:               $('#payment-currency').val(),
      serviceNames:           serviceNames
    }

    this.setState(newState, function() {
      console.log(JSON.stringify(this.state));
    });

  },
  componentDidMount: function() {

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/paymentMethods/',
      type: "GET",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        var paymentMethods = response;

        console.log(paymentMethods)

        var PaymentMethodContainer = React.createClass({
          render: function() {
            var paymentMethodHTML = []
            paymentMethods.forEach(function(payment) {
              console.log(payment)
              if (payment.type === 'CARD') {
                paymentMethodHTML.push(
                  <div>
                    <input name="payments" type="radio" data-value={payment.id} id={payment.id} />
                    <label for={payment.id}></label>
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
                  <div>
                    <div class='booking-payment-radio'>
                      <input name="payments" type="radio" data-value={payment.id} id={payment.id} />
                      <label for={payment.id}></label>
                    </div>
                    <div class='booking-payment-method'>
                      <Paypal
                        default={payment.default}
                        email={payment.email}
                      />
                    </div>

                  </div>

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

        // Render payment method UI
        ReactDOM.render(
          <PaymentMethodContainer
          />, document.querySelector('#payment-methods')
        )

      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })

    // Extra guests equals number of guests minus one
    $('select#EXTRA_GUEST').val($('#guest-count').attr('data-guests') - 1);

    // Modify UI to match query params
    function setQueriedValue(name) {
      if ($('select#'+name).attr('data-value') !== '') {
        $('select#'+name).val($('select#'+name).attr('data-value'));
      }
    }

    // List of potential url queries
    var potentialQueries = [
      "learning",
      "booking-immersions",
      "meal_plan",
      "diet_restrictions",
      "course"
    ];

    // Set input values to url query values
    potentialQueries.forEach(setQueriedValue);

    $('select#booking-immersions').change(function() {
      if ($(this).val() === 'stay') {
        // Hide and show for tandem
        $('.immersion-field').hide();
        $('.stay-field:not(select)').show();
      } else if ($(this).val() === 'tandem') {
        // Hide and show for tandem
        $('.immersion-field').hide();
        $('.tandem-field:not(select)').show();
      } else if ($(this).val() === 'teacher') {
        // Hide and show for teacher
        $('.immersion-field').hide();
        $('.teacher-field:not(select)').show();
      }
    })

    $('.immersion-field').hide();
    $('select#booking-immersions').trigger('change');

    this.refreshState();

  },
  componentDidUpdate: function() {
  },
  render: function() {

    return (
      <div></div>
    );
  }
});
