var React = require('react');
var ReactDOM = require('react-dom');

var JWT = require('JWT');
var GET = require('GET');
var POST = require('POST');

var AddPaymentMethod = require('../../global/components/add-payment-method.react');
var Paypal = require('../../global/components/payment-method--paypal.react');
var CreditCard = require('../../global/components/payment-method--credit-card.react');

var domains = require('domains');

require('../scrollspy');
$('.scrollspy').scrollSpy();

var currencies = require('currencies');

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['homes', 'immersions', 'languages']);

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

    var stayType = $('select#booking-immersions option:selected').val();

    if (stayType === 'stay' || stayType === 'tandem') {
      var weeklyHours = parseInt($('select#'+stayType+'-learning').attr('data-hours'));
    } else {
      var weeklyHours = parseInt($('select#teacher-hours').val());
    }

    $('select#booking-immersions').val() === 'teacher' ? $('select#teacher-hours').val() : null

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
      paymentMethodId:            $('.booking-payment-radio input:checked').length > 0 ? parseInt($('.booking-payment-radio input:checked').attr('data-value')) : null,
      weeklyHours:                weeklyHours,
      partOfDay:                  null,
      settingNames:               $('select#meal_pref').val() !== '' ? $('select#meal_pref').val() : []
    }

    console.log(bookingObj)

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
      $('.booking-payment-radio input:checked').length > 0
    ) {
      $('#request-booking-btn').hasClass('disabled') ? $('#request-booking-btn').removeClass('disabled') : null;
    } else {
      !($('#request-booking-btn').hasClass('disabled')) ? $('#request-booking-btn').addClass('disabled') : null;
    }
  },
  requestBooking: function() {

    $('#preloader').show();

    var bookingObj = this.createBookingObject();

    var url = domains.API+'/users/'+JWT.rid+'/bookings';
    var success = function() {
      window.location = '/booking-success';
    }
    POST(url, bookingObj, success);

  },
  refreshState: function() {

    var bookingObj = this.createBookingObject();

    this.setState(bookingObj, function() {

      console.log(JSON.stringify(this.state));

      var currency = this.state.currency;
      // Refresh read-only display nodes
      $('.immersion-display').html(i18n.t('immersions:'+$('#booking-immersions').val()));
      console.log(i18n.t('immersions:stay'))
      $('.language-display').html(i18n.t('languages:'+this.state.languageHostWillTeach));

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
    delete bookingObj.paymentMethodId;
    var url = domains.API+'/users/'+JWT.rid+'/bookings/price';
    var data = {};
    var success = function(response) {
      $('.total-price').html(currencies[this.state.currency]+Math.ceil(response));
    }.bind(this);
    POST(url, bookingObj, success);

    var callback = this.refreshState;

    var url = domains.API+'/users/'+JWT.rid+'/paymentMethods/';
    var success = function(response) {

      var paymentMethods = response;

      var PaymentMethodContainer = React.createClass({
        render: function() {

          var paymentMethodHTML = []

          if (paymentMethods.length > 0) {
            paymentMethods.forEach(function(payment) {
              if (payment.type === 'CARD') {
                paymentMethodHTML.push(
                  <div>
                    <div class='booking-payment-radio'>
                      <input name="payments" type="radio" data-value={payment.id} id={payment.id} />
                      <label for={payment.id}></label>
                    </div>
                    <div class='booking-payment-method'>
                      <CreditCard
                        id={payment.id}
                        default={payment.default}
                        expiry={payment.expiry}
                        lastFour={payment.lastFour}
                        cardHolder={payment.cardHolder}
                        deleteCallback={callback}
                      />
                    </div>
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
                        deleteCallback={callback}
                      />
                    </div>

                  </div>

                )
              }
            })
          }

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

      this.validateBooking(bookingObj);

      $('#preloader').hide();

    }.bind(this);
    GET(url, success)

  },
  componentDidMount: function() {

    $('a#request-booking-btn').click(this.requestBooking);

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

    // Render add payment method
    var callback = this.refreshState;
    ReactDOM.render(
      <AddPaymentMethod
        callback={callback}
      />, document.querySelector('#add-payment-method')
    )

    $('form#add-payment-form ul').collapsible();

    this.refreshState();

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
