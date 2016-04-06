var Pikaday = require('pikaday');
var formatDate = require('format-date');

if ($('input.arrival').length && $('input.departure').length) {


  // Initial variables used throughout
  var startDate;
  var endDate;
  var today = new Date();
  var tomorrow = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);

  // Function to be called upon arrival picker selection
  var updateStartDate = function() {

    var formattedDate = formatDate(startDate)

    // Iterate over all arrival pickers and set new date and new start range
    for (var i = 0; i < arrivalPickers.length; i++) {
      arrivalPickers[i].setStartRange(startDate);
      arrivalPickers[i].setDate(null);
      $('input.arrival').val(formattedDate);
    }

    // Iterate over all departure pickers and set new start range and new min date
    for (var i = 0; i < departurePickers.length; i++) {
      departurePickers[i].setStartRange(startDate);
      departurePickers[i].setMinDate(startDate);
    }

  }

  // Function to be called upon departure picker selection
  var updateEndDate = function() {

    var formattedDate = formatDate(endDate)

    // Iterate over all arrival pickers and set new end range and new max date
    for (var i = 0; i < arrivalPickers.length; i++) {
      arrivalPickers[i].setEndRange(endDate);
      arrivalPickers[i].setMaxDate(endDate);
    }

    // Iterate over all departure pickers and set new end range and new date
    for (var i = 0; i < departurePickers.length; i++) {
      departurePickers[i].setEndRange(endDate);
      departurePickers[i].setDate(null);
      $('input.departure').val(formattedDate);
    }
  }

  // Arrays into which pickers will be pushed to later iterate over
  var arrivalPickers = [];
  var departurePickers = [];

  // Init arrival pickers
  $('input.arrival').each(function() {

    var _trigger = this;
    var picker = new Pikaday({
      minDate: today,
      field: this,
      defaultDate: $(this).attr('data-date'),
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
      defaultDate: $(this).attr('data-date'),
      onSelect: function() {

        // Set new end date and update pickers
        endDate = this.getDate()
        updateEndDate();

      }
    });
    departurePickers.push(picker);
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
