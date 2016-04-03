var Wallop = require('wallop');
var newMessageThread = require('new-message-thread');

var pikaday = require('pikaday');

var i18n = require('../global/util/i18n');

// Initialisations
$(document).ready(function() {

  if ($('.help-button').length) {
    $('.help-button').click(function() {
      $('#help-modal').openModal()
    })
  }

  if ($('a.create-new-message-thread').length) {
    $('a.create-new-message-thread').click(function() {
      newMessageThread();
    })
  }

  if ($('#hero-search').length) {
    $('#hero-search').click(function() {

      var language = $('#language option:selected').val() !== '' ? '&language=' + $('#language option:selected').attr('data-lang') : '';
      var location = $('#location').val() !== '' ? '&location_string=' + ($('#location').val()).replace(/ /g, "_") : '';
      var arrival = $('#arrival').val() !== '' ? '&arrival=' + $('#arrival').val() : '';
      var departure = $('#departure').val() !== '' ? '&departure=' + $('#departure').val() : '';
      var guests = $('#guest-count').val() !== 'undefined' ? '?guests=' + $('#guest-count').val() : '';

      var url = '/search' + guests + language + location + arrival + departure;

      window.location = url;

    })
  }

  if ($('form.inert').length) {
    $('form.inert').submit(function(e) {
      return false;
    })
  }

  if ($('.wallop').length) {
    $('.wallop').each(function() {
      var wallopEl = this;
      var slider = new Wallop(wallopEl);
    })
  }

  // Carousel
  if ($('.carousel').length) {
    $('.carousel').carousel({
      dist: 0,
    });
  }

  // Select2 language to learn
  if ($('select#language').length) {
    i18n.loadNamespaces(['search'], function() {
      $("select#language").select2({
        placeholder: i18n.t('search:language_to_learn')
      });
    });
  }

  // Select2 language to teach
  if ($('select#language-teach').length) {
    i18n.loadNamespaces(['search'], function() {
      $("select#language-teach").select2({
        placeholder: i18n.t('search:language_to_teach')
      });
    });
  }

  // Modal
  if ($('.modal-trigger').length) {
    $('.modal-trigger').leanModal();
  }

  // Select
  if ($('select.material').length) {
    $('select.material').material_select();
    $("select.material[required]").css({
      display: "block",
      height: '1px',
      padding: 0,
      width: '1px',
      opacity: 0,
      border: 0,
      position: 'absolute'
    });
  }

  // Sidenav
  if ($('.button-collapse').length) {
    $(".button-collapse").sideNav();
  }

  var Pikaday = require('pikaday');

  var formatDate = require('format-date');

  if ($('input.birthday').length) {

    // Users must be at least 18, so generate minimum date
    var eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear()-18);

    // Init birthday datepickers
    $('input.birthday').each(function() {
      var picker = new Pikaday({
        format: 'YYYY-MM-DD',
        maxDate: eighteenYearsAgo,
        field: this,
        yearRange: [1950, eighteenYearsAgo.getFullYear()]
      });
    })
  }

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
        format: 'YYYY-MM-DD',
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
});
