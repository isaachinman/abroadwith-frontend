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

  // Booking datepicker
  if ($('.datepicker').length) {
    $('.datepicker').pickadate({
      onSet: function () {
        this.close();
      }
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

  // Birthday datepicker
  if ($('.datepicker-birthday').length) {
    $('.datepicker-birthday').pickadate();
  }

  // Tabs
  if ($('ul.tabs')) {
    $(document).ready(function(){
      $('ul.tabs').tabs();
    });
  }

});
