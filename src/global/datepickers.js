const Pikaday = require('pikaday')
const uiDate = require('ui-date')

const i18n = require('i18n')

if ($('input.arrival').length && $('input.departure').length) {

  // Initial variables used throughout
  var startDate
  var endDate
  var today = new Date()
  var tomorrow = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)

  // Function to be called upon arrival picker selection
  var updateStartDate = function() {

    // Iterate over all arrival pickers and set new date and new start range
    for (var i = 0; i < arrivalPickers.length; i++) {
      arrivalPickers[i].setStartRange(startDate)
      arrivalPickers[i].setDate(null)
      $('input.arrival').val(uiDate(startDate))
    }

    if (startDate > endDate) {
      for (var i = 0; i < departurePickers.length; i++) {
        departurePickers[i].setStartRange(startDate)
        departurePickers[i].setEndRange(null)
        departurePickers[i].setDate(null)
      }
      for (var i = 0; i < arrivalPickers.length; i++) {
        arrivalPickers[i].setEndRange(null)
      }
    } else {

      // Iterate over all departure pickers and set new start range and new min date
      var minDate = new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000)
      var month = minDate.getMonth()
      for (var i = 0; i < departurePickers.length; i++) {
        departurePickers[i].gotoMonth(month)
        departurePickers[i].setStartRange(startDate)
        departurePickers[i].setMinDate(minDate)
      }

    }

  }

  // Function to be called upon departure picker selection
  var updateEndDate = function() {

    // Iterate over all arrival pickers and set new end range and new max date
    for (var i = 0; i < arrivalPickers.length; i++) {
      arrivalPickers[i].setEndRange(endDate)

    }

    if (startDate > endDate) {
      for (var i = 0; i < departurePickers.length; i++) {
        departurePickers[i].setStartRange(startDate)
        departurePickers[i].setEndRange(null)
        departurePickers[i].setDate(null)
      }
      for (var i = 0; i < arrivalPickers.length; i++) {
        arrivalPickers[i].setEndRange(null)
      }
    } else {

      // Iterate over all departure pickers and set new end range and new date
      for (var i = 0; i < departurePickers.length; i++) {
        departurePickers[i].setEndRange(endDate)
        departurePickers[i].setDate(null)
        $('input.departure').val(uiDate(endDate))
      }

    }
  }

  // Arrays into which pickers will be pushed to later iterate over
  var arrivalPickers = []
  var departurePickers = []

  i18n.loadNamespaces(['common'],function(){

    var translatedDates = {
      previousMonth: i18n.t('common:previousMonth'),
      nextMonth: i18n.t('common:nextMonth'),
      months: [i18n.t('common:months.m1'), i18n.t('common:months.m2'), i18n.t('common:months.m3'), i18n.t('common:months.m4'), i18n.t('common:months.m5'), i18n.t('common:months.m6'), i18n.t('common:months.m7'), i18n.t('common:months.m8'), i18n.t('common:months.m9'), i18n.t('common:months.m10'), i18n.t('common:months.m11') ,i18n.t('common:months.m12')],
      weekdays: [i18n.t('common:weekdays.sun'), i18n.t('common:weekdays.mon'), i18n.t('common:weekdays.tue'), i18n.t('common:weekdays.wed'), i18n.t('common:weekdays.thu'), i18n.t('common:weekdays.fri'), i18n.t('common:weekdays.sat')],
      weekdaysShort: [i18n.t('common:weekdaysShort.sun'), i18n.t('common:weekdaysShort.mon'), i18n.t('common:weekdaysShort.tue'), i18n.t('common:weekdaysShort.wed'), i18n.t('common:weekdaysShort.thu'), i18n.t('common:weekdaysShort.fri'), i18n.t('common:weekdaysShort.sat')]
    }

    // Init arrival pickers
    $('input.arrival').each(function() {

      var _trigger = this;
      var picker = new Pikaday({
        minDate: today,
        field: this,
        defaultDate: $(this).attr('data-date'),
        i18n: translatedDates,
        onSelect: function() {

          // Capture whether selection is the first time
          var firstSelection = startDate == undefined ? true : false

          // Set new start date and update pickers
          startDate = this.getDate()
          updateStartDate()

          // Only open departure picker if it's the first selection
          if (firstSelection) {
            for (var i = 0; i < arrivalPickers.length; i++) {

              // Find departure picker that matches this arrival picker
              arrivalPickers[i]._o.trigger == _trigger ? departurePickers[i].show() : null

            }
          }

        }
      });
      arrivalPickers.push(picker)
    })

    // Init departure pickers
    $('input.departure').each(function() {
      var picker = new Pikaday({
        minDate: tomorrow,
        field: this,
        i18n: translatedDates,
        defaultDate: $(this).attr('data-date'),
        onSelect: function() {

          // Set new end date and update pickers
          endDate = this.getDate()
          updateEndDate()

        }
      });
      departurePickers.push(picker)
    })

  })

  // If arrival picker has a value on pageload, update pickers
  if ($('.arrival').first().val() !== '') {
    startDate = new Date($('.arrival').val());
    updateStartDate();
  }

  // If departure picker has a value on pageload, update pickers
  if ($('.departure').first().val() !== '') {
    endDate = new Date($('.departure').val())
    updateEndDate()
  }

}

if ($('input.birthday').length) {

  i18n.loadNamespaces(['common'],function(){

    var translatedDates = {
      previousMonth: i18n.t('common:previousMonth'),
      nextMonth: i18n.t('common:nextMonth'),
      months: [i18n.t('common:months.m1'), i18n.t('common:months.m2'), i18n.t('common:months.m3'), i18n.t('common:months.m4'), i18n.t('common:months.m5'), i18n.t('common:months.m6'), i18n.t('common:months.m7'), i18n.t('common:months.m8'), i18n.t('common:months.m9'), i18n.t('common:months.m10'), i18n.t('common:months.m11') ,i18n.t('common:months.m12')],
      weekdays: [i18n.t('common:weekdays.sun'), i18n.t('common:weekdays.mon'), i18n.t('common:weekdays.tue'), i18n.t('common:weekdays.wed'), i18n.t('common:weekdays.thu'), i18n.t('common:weekdays.fri'), i18n.t('common:weekdays.sat')],
      weekdaysShort: [i18n.t('common:weekdaysShort.sun'), i18n.t('common:weekdaysShort.mon'), i18n.t('common:weekdaysShort.tue'), i18n.t('common:weekdaysShort.wed'), i18n.t('common:weekdaysShort.thu'), i18n.t('common:weekdaysShort.fri'), i18n.t('common:weekdaysShort.sat')]
    }

    // Users must be at least 18, so generate minimum date
    var eighteenYearsAgo = new Date()
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear()-18)

    // Init birthday datepickers
    $('input.birthday').each(function() {
      var picker = new Pikaday({
        maxDate: eighteenYearsAgo,
        defaultDate: eighteenYearsAgo,
        field: this,
        i18n: translatedDates,
        yearRange: [1900, eighteenYearsAgo.getFullYear()],
        onSelect: function() {
          $('input.birthday').val(uiDate(this.getDate()))
        }
      });
    })

  })


}
