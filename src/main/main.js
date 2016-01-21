var select2 = require('select2')

// Languages
var languages = [
  {
    id: 0,
    text: 'English'
  },
  {
    id: 1,
    text: 'Spanish'
  },
  {
    id: 2,
    text: 'Portuguese'
  }
];

$(document).ready(function() {

  $( "#language" ).select2({
    placeholder: "What language do you want to learn?",
    data: languages
  });

});

// Materialize initialisations
$(document).ready(function() {

  // Modal
  if ($('.modal-trigger').length) {
    $('.modal-trigger').leanModal();
  }

  // Select
  if ($('select').length) {
    $('select').material_select();
  }

  // Sidenav
  if ($('.button-collapse').length) {
    $(".button-collapse").sideNav();
  }

  // Booking datepicker
  if ($('.datepicker').length) {
    $('.datepicker').pickadate({
      format: 'dd/mm/yyyy',
      min: 1,
      onSet: function () {
        this.close();
      }
    });
  }

  // Birthday datepicker
  if ($('.datepicker-birthday').length) {
    $('.datepicker-birthday').pickadate({
      format: 'dd/mm/yyyy',
      container: 'body',
      onSet: function () {
        this.close();
      }
    });
  }

  // Tabs
  if ($('ul.tabs')) {
    $(document).ready(function(){
      $('ul.tabs').tabs();
    });
  }

});
