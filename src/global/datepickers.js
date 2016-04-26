const Pikaday = require('pikaday')
const uiDate = require('ui-date')

const i18n = require('i18n')

if ($('input.arrival').length && $('input.departure').length) {

  // Initial variables used throughout
  var startDate;
  var endDate;
  var today = new Date();
  var tomorrow = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);

  // Function to be called upon arrival picker selection
  var updateStartDate = function() {

    // Iterate over all arrival pickers and set new date and new start range
    for (var i = 0; i < arrivalPickers.length; i++) {
      arrivalPickers[i].setStartRange(startDate);
      arrivalPickers[i].setDate(null);
      $('input.arrival').val(uiDate(startDate));
    }

    if (startDate > endDate) {
      for (var i = 0; i < departurePickers.length; i++) {
        departurePickers[i].setStartRange(startDate);
        departurePickers[i].setEndRange(null);
        departurePickers[i].setDate(null);
        departurePickers[i].show()
      }
      for (var i = 0; i < arrivalPickers.length; i++) {
        arrivalPickers[i].setEndRange(null);
      }
    } else {

      // Iterate over all departure pickers and set new start range and new min date
      var minDate = new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000)
      var month = minDate.getMonth();
      for (var i = 0; i < departurePickers.length; i++) {
        departurePickers[i].gotoMonth(month);
        departurePickers[i].setStartRange(startDate);
        departurePickers[i].setMinDate(minDate);
      }

    }

  }

  // Function to be called upon departure picker selection
  var updateEndDate = function() {

    // Iterate over all arrival pickers and set new end range and new max date
    for (var i = 0; i < arrivalPickers.length; i++) {
      arrivalPickers[i].setEndRange(endDate);

    }

    if (startDate > endDate) {
      for (var i = 0; i < departurePickers.length; i++) {
        departurePickers[i].setStartRange(startDate);
        departurePickers[i].setEndRange(null);
        departurePickers[i].setDate(null);
        departurePickers[i].show()
      }
      for (var i = 0; i < arrivalPickers.length; i++) {
        arrivalPickers[i].setEndRange(null);
      }
    } else {

      // Iterate over all departure pickers and set new end range and new date
      for (var i = 0; i < departurePickers.length; i++) {
        departurePickers[i].setEndRange(endDate);
        departurePickers[i].setDate(null);
        $('input.departure').val(uiDate(endDate));
      }

    }
  }

  // Arrays into which pickers will be pushed to later iterate over
  var arrivalPickers = [];
  var departurePickers = [];

  i18n.loadNamespaces(['common'],function(){

    var translatedDates = {
      previousMonth: i18n.t('common:previousMonth'),
      nextMonth: i18n.t('common:nextMonth'),
      months: [i18n.t('common:months.jan'), i18n.t('common:months.feb'), i18n.t('common:months.mar'), i18n.t('common:months.apr'), i18n.t('common:months.may'), i18n.t('common:months.june'), i18n.t('common:months.july'), i18n.t('common:months.aug'), i18n.t('common:months.sep'), i18n.t('common:months.oct'), i18n.t('common:months.nov') ,i18n.t('common:months.dec')],
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
          var firstSelection = startDate == undefined ? true : false;

          // Set new start date and update pickers
          startDate = this.getDate();
          updateStartDate();

          // Only open departure picker if it's the first selection
          if (firstSelection) {
            for (var i = 0; i < arrivalPickers.length; i++) {

              // Find departure picker that matches this arrival picker
              arrivalPickers[i]._o.trigger == _trigger ? departurePickers[i].show() : null;

            }
          }

        }
      });
      arrivalPickers.push(picker);
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
          updateEndDate();

        }
      });
      departurePickers.push(picker);
    })

  })

  // If arrival picker has a value on pageload, update pickers
  if ($('.arrival').first().val() !== '') {
    startDate = new Date($('.arrival').val());
    updateStartDate();
  }

  // If departure picker has a value on pageload, update pickers
  if ($('.departure').first().val() !== '') {
    endDate = new Date($('.departure').val());
    updateEndDate();
  }

}
