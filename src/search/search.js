// Deps
var React = require('react');
var ReactDOM = require('react-dom');
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
