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

  // Send home profile view tracking event
  ga('send', 'event', 'user_events', 'home_profile_view')

  function dateChange() {

    // Allow some arbitrary period of time for datepickers to update
    setTimeout(function() {

      var arrival = $('#arrival').val() !== '' ? ($('#arrival').val()) : null;
      var departure = $('#departure').val() !== '' ? ($('#departure').val()) : null;

      // If user has selected arrival and departure dates, remove instructional tooltip
      if (arrival !== null && departure !== null) {
        $('.go-to-booking').tooltip('remove');
      }

      // If browser supports history API, do some query stuff
      if (history.pushState) {
        var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?'
        arrival !== null ? newUrl = newUrl + 'arrival=' + arrival + '&' : null;
        departure !== null ? newUrl = newUrl + 'departure=' + departure + '&' : null;
        window.history.pushState({path:newUrl}, '', newUrl)
      }

    },100)

  }

  // On datepicker change, validate and remove tooltip if necessary
  $('#arrival').change(function() {
    dateChange()
  })
  $('#departure').change(function() {
    dateChange()
  })

}
