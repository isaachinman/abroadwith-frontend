var Wallop = require('wallop');

// Initialisations
$(document).ready(function() {

  if ($('#hero-search').length) {
    $('#hero-search').click(function() {

      var language = $('#language option:selected').attr('data-lang') !== 'undefined' ? '&language=' + $('#language option:selected').attr('data-lang') : null;
      var arrival = $('#arrival').val() !== '' ? '&arrival=' + $('#arrival').val() : null;
      var departure = $('#departure').val() !== '' ? '&departure=' + $('#departure').val() : null;
      var guests = $('#guest-count').val() !== 'undefined' ? '&guests=' + $('#guest-count').val() : null;

      var url = '/search?minLat=53.27221892583479&minLng=14.0710001425781&maxLat=51.75469082335137&maxLng=12.73890785742185' + language + arrival + departure + guests;

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
    $("select#language").select2({
      placeholder: "What language are you learning?"
    });
  }

  // Select2 language to teach
  if ($('select#language-teach').length) {
    $("select#language-teach").select2({
      placeholder: "What language do you want to teach?"
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

  // Arrival datepicker
  if ($('#arrival').length) {

    // Set up min and max dates
    var today = new Date();
    var tomorrow = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);
    var yearToday = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);

    // Initialise datepicker
    $('#arrival').pickadate({

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
          departurePicker.set('clear');
          departurePicker.set('min', arrivalPlusOne);
          this.close();
        }
      }

    });
  }

  // Departure datepicker
  if ($('#departure').length) {
    var today = new Date();
    var weekToday = new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000);
    $('#departure').pickadate({
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
    var departurePicker = $('#departure').pickadate('picker');
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
