var Wallop = require('wallop');
var newMessageThread = require('new-message-thread');

var pikaday = require('pikaday');

var i18n = require('../global/util/i18n');

// Initialisations
$(document).ready(function() {

  if ($('a.create-new-message-thread').length) {
    $('a.create-new-message-thread').click(function() {
      newMessageThread();
    })
  }

  if ($('#hero-search').length) {
    $('#hero-search').click(function() {

      var language = $('#language option:selected').val() !== '' ? '&language=' + $('#language option:selected').attr('data-lang') : '';
      var location = $('#location').val() !== '' ? '&location_string=' + ($('#location').val()).replace(/ /g,"_") : '';
      var arrival = $('#arrival').val() !== '' ? '&arrival=' + $('#arrival').val() : '';
      var departure = $('#departure').val() !== '' ? '&departure=' + $('#departure').val() : '';
      var guests = $('#guest-count').val() !== 'undefined' ? '?guests=' + $('#guest-count').val() : '';

      var url = '/search'+ guests + language + location + arrival + departure;

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
        maxDate: eighteenYearsAgo,
        defaultDate: eighteenYearsAgo,
        field: this,
        yearRange: [1950, eighteenYearsAgo.getFullYear()],
        onSelect: function() {
          $('input.birthday').val(formatDate(this.getDate()))
        }
      });
    })
  }
});
