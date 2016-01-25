$(document).ready(function() {

  $("select#language").select2({
    placeholder: "What language do you want to learn?"
  });

});

// Materialize initialisations
$(document).ready(function() {

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
    var today = new Date();
    var tomorrow = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);
    var yearToday = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);
    $('#arrival').pickadate({
      min:tomorrow,
      max:yearToday,
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
      min:weekToday
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
