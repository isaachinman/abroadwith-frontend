const domains = require('domains');
const JWT = require('JWT');

const apiDate = require('api-date');

const i18n = require('i18n');
const toast = require('toast');

if ($('#book-a-room').length) {
  $('#book-a-room').click(function() {
    $('html, body').animate({
        scrollTop: $('#book-now').offset().top - 50
    }, 250);
  })
}

// If on a home page with at least one bookable room
if ($('.go-to-booking').length) {

  // Click function for book buttons
  $('.go-to-booking').click(function() {

    var bookingUrl = '/homes/' + $(this).attr('data-hid') + '/booking?arrival=' + apiDate($('#arrival').val()) + '&departure=' + apiDate($('#departure').val()) + '&room_id=' + $(this).attr('data-rid');

    if ($('#arrival').val() !== '' && $('#departure').val() !== '') {

      $('#preloader').show();

      // Protect booking page against 400s from already booking dates
      var bookingObj = {
        // Conditionally set up state per category
        stayId:                     parseInt($(this).attr('data-stay-id')),
        arrivalDate:                apiDate($('#arrival').val()),
        departureDate:              apiDate($('#departure').val()),
        roomId:                     parseInt($(this).attr('data-rid')),
        guestCount:                 1,
        languageHostWillTeach:      $('.chip--speaks').first().attr('data-lang'),
        languageGuestWillTeach:     null,
        currency:                   'EUR',
        serviceNames:               [],
        weeklyHours:                7,
        partOfDay:                  null,
        settingNames:               []
      }

      $.ajax({
        type: "POST",
        url: domains.API+'/users/'+JWT.rid+'/bookings/price',
        contentType: "application/json",
        data: JSON.stringify(bookingObj),
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
        success: function(response) {

          window.location = bookingUrl;

        },
        error: function() {

          $('#preloader').hide();
          i18n.loadNamespaces(['common'],function(){
            toast(i18n.t('common:room_unavailable_toast'));
          })

        }
      })
    }
  })

  // On datepicker change, validate and remove tooltip if necessary
  $('#arrival, #departure').change(function() {
    if ($('#arrival').val() !== '' && $('#departure').val() !== '') {
      $('.go-to-booking').tooltip('remove');
    }
  })

}
