// var $ = require('jquery');
// var React = require('react');
// var ReactDOM = require('react-dom');
// var materialize = require('materialize');

// Tap events
// var injectTapEventPlugin = require("react-tap-event-plugin");
// injectTapEventPlugin();

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

  // Datepicker
  if ($('.datepicker').length) {
    $('.datepicker').pickadate({
      min: 1
    });
  }

});
