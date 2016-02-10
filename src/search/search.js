// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var SearchMap = require('./components/search-map.react');
var SearchContainer = require('./components/search-container.react');


if ($('#search-container').length) {
  // Search parent
  ReactDOM.render(
    <SearchContainer
    source='/search'
    />, document.querySelector('#search-container')
  )

}
