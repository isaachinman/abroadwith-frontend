// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var SearchList = require('./components/searchList.react');
var Nouislider = require('react-nouislider');
require('wnumb');

// Toggle more filters caret
if ($('.collapsible-header i').length) {
  var caret = $('.collapsible-header i');
  $('.collapsible-header').click(function() {
    if (caret.hasClass('fa-caret-down')) {
      caret.removeClass('fa-caret-down');
      caret.addClass('fa-caret-up');
    } else if (caret.hasClass('fa-caret-up')) {
      caret.removeClass('fa-caret-up');
      caret.addClass('fa-caret-down');
    }
  })
}

// If user selects Tandem, show them Tandem Language input
if ($('select#immersion').length && ($('input#tandem-language').length)) {
  var immersionSelect = $('select#immersion');
  var tandemInput = $('input#tandem-language');
  var tandemNodes = $('.tandem-language');
  immersionSelect.change(function() {
    if (immersionSelect.val().indexOf('tandem') >= 0 && tandemNodes.hasClass('hide')) {
      $('.tandem-language').removeClass('hide');
    } else if (!(immersionSelect.val().indexOf('tandem')) >= 0 && !(tandemNodes.hasClass('hide'))) {
      $('.tandem-language').addClass('hide');
    }
  })
}

// If user toggles language school, toggle disabled on language school dropdown
if ($('#language-switch').length && $('#language-school').length) {
  var languageSwitch = $('input#language-switch');
  var languageSelect = $('select#language-school');
  languageSwitch.change(function() {
    if (languageSwitch.is(':checked') && languageSelect.prop('disabled', true)) {
      languageSelect.prop('disabled', false);
      languageSelect.material_select();
    } else if (languageSwitch.not(':checked') && languageSelect.prop('disabled', false)) {
      languageSelect.prop('disabled', true);
      languageSelect.material_select();
    }
  })
}

// If user selects meal plan, toggle disabled on dietary restrictions dropdown
if ($('#meal-plan').length && $('#dietary-restrictions').length) {
  var mealPlan = $('#meal-plan');
  var dietaryRestrictions = $('#dietary-restrictions');
  mealPlan.change(function() {
    if (mealPlan.val() != 'none' && dietaryRestrictions.prop('disabled', true)) {
      dietaryRestrictions.prop('disabled', false);
      dietaryRestrictions.material_select();
    } else if (mealPlan.val() == 'none' && dietaryRestrictions.prop('disabled', false)) {
      dietaryRestrictions.val('none');
      dietaryRestrictions.prop('disabled', true);
      dietaryRestrictions.material_select();
    }
  })
}

// Render search
if ($('#content-search').length) {
  ReactDOM.render(
    <SearchList />,
    document.getElementById('content-search')
  );
}

// Price slider
if ($('#price-slider').length) {

  // Price vars
  var priceMin = 100;
  var priceMax = 2000;
  var currency = '€';

  ReactDOM.render(
    <Nouislider
      range={{min: 100, max: 2000}}
      margin={100}
      start={[1200, 1800]}
      tooltips
      format={wNumb({
        prefix: currency,
        decimals: 0
      })}
      step={10}
    />, document.querySelector('#price-slider')
  );
}

// Datepickers
var dateArrival = new Date();
var dateDeparture = new Date();
dateDeparture.setDate(dateDeparture.getDate() + 10);
// Arrival datepicker
if ($('.datepicker-arrival').length) {
  $('.datepicker-arrival').pickadate({
    min: 1,
    onStart: function () {
      this.set('select', dateArrival)
    },
    onSet: function () {
      this.close();
    }

  });
}
// Arrival datepicker
if ($('.datepicker-departure').length) {
  $('.datepicker-departure').pickadate({
    min: 1,
    onStart: function () {
      this.set('select', dateDeparture)
    },
    onSet: function () {
      this.close();
    }

  });
}
