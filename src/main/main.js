// var $ = require('jquery');
// var React = require('react');
// var ReactDOM = require('react-dom');
// var materialize = require('materialize');
// var autocomplete = require('jquery-ui/autocomplete')

// Tap events
// var injectTapEventPlugin = require("react-tap-event-plugin");
// injectTapEventPlugin();

// Languages
var languages = [
  "English",
  "Spanish",
  "Portugese"
];

$( "#language" ).autocomplete({
  source: languages
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
      min: 1,
      onSet: function () {
        this.close();
      }
    });
  }

  // Birthday datepicker
  if ($('.datepicker-birthday').length) {
    $('.datepicker-birthday').pickadate({
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
