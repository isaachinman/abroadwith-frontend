// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var SearchList = require('./components/searchList.react');
var SearchMap = require('./components/search-map.react');
var SearchContainer = require('./components/search-container.react');

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
if ($('select#immersion').length && ($('select#language-teach').length)) {
  var immersionSelect = $('select#immersion');
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

// Search parent
ReactDOM.render(
  <SearchContainer
  source='/search'
  />, document.querySelector('#search-container')
)

$.post('/search?default', function(data) {
  var response = JSON.parse(data);
  console.log(data);
})
