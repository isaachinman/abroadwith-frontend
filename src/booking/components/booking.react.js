var React = require('react');
var ReactDOM = require('react-dom');

var AddPaymentMethod = require('../../global/components/add-payment-method.react');
var Paypal = require('../../global/components/payment-method--paypal.react');
var Bank = require('../../global/components/payment-method--bank.react');

var domains = require('domains');
var jwt_decode = require('jwt-decode');

require('../scrollspy');
$('.scrollspy').scrollSpy();

var currencies = require('currencies');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['homes']);

module.exports = React.createClass({
  createBookingObject: function() {

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
    $('#meal_plan').val() === 'HALF_BOARD' || $('#meal_plan').val() === 'FULL_BOARD' ? serviceNames.push($('#meal_plan').val()) : null;

    if ($('select#EXTRA_GUEST').val() !== null) {
      var guests = parseInt($('select#EXTRA_GUEST').val())+1;
      $('#guests').html($('select#EXTRA_GUEST').val() > 1 ? (parseInt($('select#EXTRA_GUEST').val())+1) + ' guests' : (parseInt($('select#EXTRA_GUEST').val())+1) + ' guest');
      $('#guests').attr('data-value', guests);
    }

    var bookingObj = {
      // Conditionally set up state per category
      stayId:                     parseInt($('select#booking-immersions option:selected').attr('data-value')),
      arrivalDate:                $('#arrival').attr('data-value'),
      departureDate:              $('#departure').attr('data-value'),
      roomId:                     parseInt($('#room_id').attr('data-value')),
      guestCount:                 parseInt($('#guests').attr('data-value')),
      languageHostWillTeach:      languageHostWillTeach,
      languageGuestWillTeach:     languageGuestWillTeach,
      currency:                   $('#payment-currency').val(),
      serviceNames:               serviceNames,
      paymentMethodId:            $('.booking-payment-radio input:checked').length > 0 ? parseInt($('.booking-payment-radio input:checked').attr('data-value')) : null
    }
    return bookingObj;
  },
  validateBooking: function(bookingObj) {
    if (
      bookingObj.stayId !== 'undefined' && bookingObj.stayId !== null &&
      bookingObj.arrivalDate !== 'undefined' && bookingObj.arrivalDate !== null &&
      bookingObj.departureDate !== 'undefined' && bookingObj.departureDate !== null &&
      bookingObj.roomId !== 'undefined' && bookingObj.roomId !== null &&
      bookingObj.guestCount !== 'undefined' && bookingObj.guestCount !== null &&
      bookingObj.languageHostWillTeach !== 'undefined' && bookingObj.languageHostWillTeach !== null &&
      bookingObj.currency !== 'undefined' && bookingObj.currency !== null &&
      bookingObj.serviceNames !== 'undefined' && bookingObj.serviceNames !== null &&
      bookingObj.paymentMethodId !== 'undefined' && bookingObj.paymentMethodId !== null
    ) {
      $('#request-booking-btn').hasClass('disabled') ? $('#request-booking-btn').removeClass('disabled') : null;
    } else {
      !($('#request-booking-btn').hasClass('disabled')) ? $('#request-booking-btn').addClass('disabled') : null;
    }
  },
  requestBooking: function() {

    $('#preloader').show();

    var bookingObj = this.createBookingObject();

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    // Create booking
    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/bookings',
      type: "POST",
      data: JSON.stringify(bookingObj),
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        // Booking was successfully created
        window.location = '/booking-success';

      }.bind(this),
      error: function() {

        $('#preloader').hide();

        alert('Something failed');

      }
    })

  },
  refreshState: function() {

    var bookingObj = this.createBookingObject();

    this.validateBooking(bookingObj);

    delete bookingObj.paymentMethodId;

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    this.setState(bookingObj, function() {

      console.log(JSON.stringify(this.state));

      var currency = this.state.currency;
      // Refresh read-only display nodes
      $('.immersion-display').html($('#booking-immersions').val());
      $('.language-display').html(this.state.languageHostWillTeach);

      if ($('input.booking-service:checked').length > 0) {
        var extrasDisplay = '';
        $('input.booking-service:checked').each(function() {
          extrasDisplay += $(this).attr('data-value') + ' (' + currency + $(this).attr('data-price') + ')<br>';
        })
      } else {
        var extrasDisplay = 'None';
      }
      $('.extras-display').html(extrasDisplay);

      if ($('#meal_plan option:selected').val() !== 'BREAKFAST_ONLY') {
        $('.meal-display').html(i18n.t('homes:menus_offered.'+$('#meal_plan').val()) + ' (' + currencies[this.state.currency] + $('#meal_plan option:selected').attr('data-price') + ')');
      } else {
        $('.meal-display').html(i18n.t('homes:menus_offered.'+$('#meal_plan').val()));
      }

    });

    // Set price displays to loader animation
    $('.total-price').html('<div class="progress"><div class="indeterminate"></div></div>')

    // Get price
    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/bookings/price',
      type: "POST",
      data: JSON.stringify(bookingObj),
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        console.log(response);

        $('.total-price').html(currencies[this.state.currency]+Math.ceil(response));

      }.bind(this),
      error: function() {

        alert('Something failed');

      }
    })

  },
  componentDidMount: function() {

    $('a#request-booking-btn').click(this.requestBooking);

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    // If user has payment methods, render them
    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/paymentMethods/',
      type: "GET",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        var paymentMethods = response;

        if (paymentMethods.length > 0) {
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
                        id={payment.id}
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
                          id={payment.id}
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

          // Select the first payment method
          $('.booking-payment-radio input').first().attr('checked', 'checked');

        }

        $('.booking-payment-radio input').change(this.refreshState);

        // This is the primary refreshState for initial load
        this.refreshState();

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

    // Set immersion fields to current immersion type
    $('.immersion-field').hide();
    $('select#booking-immersions').trigger('change');

    // On change, refresh state
    var activeNodes = [
      $('#booking-immersions'),
      $('#stay-learning'),
      $('#tandem-learning'),
      $('#tandem-teaching'),
      $('#teacher-learning'),
      $('#teacher-hours'),
      $('#EXTRA_GUEST'),
      $('#payment-currency'),
      $('#meal_plan')
    ];

    $('.booking-service').change(this.refreshState);

    for (var i=0; i<activeNodes.length; i++) {
      activeNodes[i].change(this.refreshState);
    }

  },
  componentDidUpdate: function() {
  },
  render: function() {

    return (
      <div></div>
    );
  }
});
