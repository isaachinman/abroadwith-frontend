const domains = require('domains');
const JWT = require('JWT');

const apiDate = require('api-date');

const i18n = require('i18n');
const toast = require('toast');

module.exports = function(stayId, roomId, homeId) {

  // Assemble destination url
  var bookingUrl = '/homes/' + homeId + '/booking?arrival=' + apiDate($('#arrival').val()) + '&departure=' + apiDate($('#departure').val()) + '&room_id=' + roomId;

  // Only proceed if dates are selected
  if ($('#arrival').val() !== '' && $('#departure').val() !== '') {

    $('#preloader').show();

    // Protect booking page against 400s from already booking dates
    var bookingObj = {
      // Conditionally set up state per category
      stayId:                     stayId,
      arrivalDate:                apiDate($('#arrival').val()),
      departureDate:              apiDate($('#departure').val()),
      roomId:                     roomId,
      guestCount:                 1,
      languageHostWillTeach:      $('.chip--speaks').first().attr('data-lang'),
      languageGuestWillTeach:     null,
      currency:                   'EUR',
      serviceNames:               [],
      weeklyHours:                7,
      partOfDay:                  null,
      settingNames:               []
    }

    // Post to room price endpoint to see if room is available for these dates
    $.ajax({
      type: "POST",
      url: domains.API+'/users/'+JWT.rid+'/bookings/price',
      contentType: "application/json",
      data: JSON.stringify(bookingObj),
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        // Go to booking url
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
}
