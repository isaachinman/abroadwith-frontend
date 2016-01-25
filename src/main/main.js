var pageContext = {
  "arrival": "2016-02-20",
  "departure": "2016-04-20",
  "guests": 1
}

// Materialize initialisations
$(document).ready(function() {

  // Select2 language
  $("select#language").select2({
    placeholder: "What language do you want to learn?"
  });

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
      min:tomorrow,
      max:yearToday,

      // If arrival date exists, set as default
      onStart: function() {
        if (pageContext.arrival) {
          $('#arrival').val(pageContext.arrival);
        }
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
      min:weekToday,
      // If arrival date exists, set as default
      onStart: function() {
        if (pageContext.departure) {
          $('#departure').val(pageContext.departure);
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

  // Tabs
  if ($('ul.tabs')) {
    $(document).ready(function(){
      $('ul.tabs').tabs();
    });
  }

});
