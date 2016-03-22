// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var SearchMap = require('./components/search-map.react');
var SearchContainer = require('./components/search-container.react');
var i18n = require('../global/util/i18n');


if ($('#search-container').length) {
  i18n.loadNamespaces(['languages','common', 'homes'],function(){
    // Search parent
    ReactDOM.render(
      <SearchContainer />, document.querySelector('#search-container')
    )
  });
}
