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
    if (immersionSelect.val() != null) {
      if (immersionSelect.val().indexOf('tandem') >= 0 && tandemNodes.hasClass('hide')) {
        $('.tandem-language').removeClass('hide');
      } else if (immersionSelect.val().indexOf('tandem') == -1 && !(tandemNodes.hasClass('hide'))) {
        $('.tandem-language').addClass('hide');
      }
    } else if (tandemNodes.hasClass('hide')) {
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
      connect={true}
      tooltips
      format={wNumb({
        prefix: currency,
        decimals: 0
      })}
      step={10}
    />, document.querySelector('#price-slider')
  );
}
