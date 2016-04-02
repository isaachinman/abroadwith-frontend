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

  if ($('input.arrival').length && $('input.departure').length) {

    var startDate;
    var endDate
    var today = new Date();
    var tomorrow = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);

    var updateStartDate = function() {

      var formattedDate = formatDate(startDate)

      for (var i = 0; i < arrivalPickers.length; i++) {
        arrivalPickers[i].setStartRange(startDate);
        arrivalPickers[i].setDate(null);
        $('input.arrival').val(formattedDate);
      }
      for (var i = 0; i < departurePickers.length; i++) {
        departurePickers[i].setStartRange(startDate);
        departurePickers[i].setMinDate(startDate);
      }
    }
    var updateEndDate = function() {

      var formattedDate = formatDate(endDate)

      for (var i = 0; i < arrivalPickers.length; i++) {
        arrivalPickers[i].setEndRange(endDate);
        arrivalPickers[i].setMaxDate(endDate);
      }
      for (var i = 0; i < departurePickers.length; i++) {
        departurePickers[i].setEndRange(endDate);
        departurePickers[i].setDate(null);
        departurePickers[i]._o.trigger.value = formattedDate;
      }
    }

    var arrivalPickers = [];
    var departurePickers = [];

    $('input.arrival').each(function() {
      var _trigger = this;
      var picker = new Pikaday({
        format: 'YYYY-MM-DD',
        minDate: today,
        field: this,
        defaultDate: $(this).attr('data-date'),
        onSelect: function() {

          startDate = this.getDate();
          updateStartDate();
          $(this).closest('input.departure').show();

          for (var i = 0; i < arrivalPickers.length; i++) {
            arrivalPickers[i]._o.trigger == _trigger ? departurePickers[i].show() : null;
            console.log(arrivalPickers[i]._o.trigger)
          }

        }
      });
      arrivalPickers.push(picker);
    })

    $('input.departure').each(function() {
      var picker = new Pikaday({
        minDate: tomorrow,
        field: this,
        format: 'YYYY-MM-DD',
        onSelect: function() {
          endDate = this.getDate()
          updateEndDate();
        }
      });
      departurePickers.push(picker);
    })

    if ($('.arrival').val() !== '') {
      startDate = new Date($('.arrival').val());
      updateStartDate();
    }

    if ($('.departure').val() !== '') {
      endDate = new Date($('.departure').val());
      updateEndDate();
    }


  }
});
