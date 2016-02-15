var Wallop = require('wallop');

// Initialisations
$(document).ready(function() {

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
      placeholder: "What are you learning?"
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
          var arrivalPlusOne = new Date(dateObj.getTime() + + 1 * 24 * 60 * 60 * 1000);
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
      format: 'yyyy-mm-dd',
      min:weekToday,
      // If departure date exists, set as default
      onStart: function() {
        // if (pageContext.departure) {
        //   $('#departure').val(pageContext.departure);
        // }
      },
      onSet: function() {
        this.close();
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

});
