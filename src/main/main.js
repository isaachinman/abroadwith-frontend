var Wallop = require('wallop');
var newMessageThread = require('new-message-thread');

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

      var language = $('#language option:selected').val() !== '' ? '?language=' + $('#language option:selected').attr('data-lang') : '';
      var location = $('#location').val() !== '' ? '&location_string=' + ($('#location').val()).replace(/ /g,"_") : '';
      var arrival = $('#arrival').val() !== '' ? '&arrival=' + $('#arrival').val() : '';
      var departure = $('#departure').val() !== '' ? '&departure=' + $('#departure').val() : '';
      var guests = $('#guest-count').val() !== 'undefined' ? '&guests=' + $('#guest-count').val() : '';

      var url = '/search' + language + location + arrival + departure + guests;

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
    i18n.loadNamespaces(['search'],function(){
      $("select#language").select2({
        placeholder: i18n.t('search:language_to_learn')
      });
    });
  }

  // Select2 language to teach
  if ($('select#language-teach').length) {
    i18n.loadNamespaces(['search'],function(){
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
    $("select.material[required]").css({display: "block", height: '1px', padding: 0, width: '1px', opacity: 0, border: 0, position: 'absolute'});
  }

  // Sidenav
  if ($('.button-collapse').length) {
    $(".button-collapse").sideNav();
  }

  // Departure datepicker
  if ($('input.departure').length) {
    var departurePicker = $('input.departure').pickadate('picker');
    var today = new Date();
    var weekToday = new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000);
    $('input.departure').pickadate({

      container: 'body',
      clear: '',
      format: 'yyyy-mm-dd',
      min:weekToday,
      // If departure date exists, set as default
      onStart: function() {
        // if (pageContext.departure) {
        //   $('#departure').val(pageContext.departure);
        // }
      },
      onSet: function(e) {
        if (e.select) {
          this.close();
        }
      }
    });
  }

  // Arrival datepicker
  if ($('input.arrival').length && $('input.departure').length) {

    // Set up min and max dates
    var today = new Date();
    var tomorrow = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);
    var yearToday = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);

    // Initialise datepicker
    $('input.arrival').pickadate({

      container: 'body',
      clear: '',
      format: 'yyyy-mm-dd',
      min:tomorrow,
      max:yearToday,

      // If arrival date exists, set as default
      onStart: function() {
        // if (pageContext.arrival) {
        //   $('#arrival').val(pageContext.arrival);
        // }
      },

      // onSet, make departure datepicker have a min value of arrival + 1
      onSet: function(e) {
        if (e.select) {
          var dateString = ($('#arrival').val()).split('-').join('/');
          dateObj = new Date(dateString);
          var arrivalPlusOne = new Date(dateObj.getTime() + 1 * 24 * 60 * 60 * 1000);
          $('input#departure').pickadate('picker').set('clear');
          $('input#departure').pickadate('picker').set('min', arrivalPlusOne);
          $(this).close();
        }
      }.bind(this)

    });
  }

  // Fix stupid focus issue with datepickers
  $.each($('.datepicker') , function(index , item) {
    $(item).on('click' , function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).pickadate('picker').open();
    });
  });

  // Focus for select2
  if ($('.select2-drop')) {

  }

});
