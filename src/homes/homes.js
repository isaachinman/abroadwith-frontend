var domains = require('domains');
var JWT = require('JWT');
var toast = require('toast');

if ($('#book-a-room').length) {
  $('#book-a-room').click(function() {
    console.log('click')
    $('html, body').animate({
        scrollTop: $('#book-now').offset().top - 50
    }, 250);
  })
}

// If on a home page with at least one bookable room
if ($('.go-to-booking').length) {

  // Click function for book buttons
  $('.go-to-booking').click(function() {

    var bookingUrl = '/homes/' + $(this).attr('data-hid') + '/booking?arrival=' + $('#arrival').val() + '&departure=' + $('#departure').val() + '&room_id=' + $(this).attr('data-rid');

    if ($('#arrival').val() !== '' && $('#departure').val() !== '') {

      $('#preloader').show();

      // Protect booking page against 400s from already booking dates
      var bookingObj = {
        // Conditionally set up state per category
        stayId:                     parseInt($(this).attr('data-stay-id')),
        arrivalDate:                $('#arrival').val(),
        departureDate:              $('#departure').val(),
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
          toast('Room unavailable for selected dates')

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
