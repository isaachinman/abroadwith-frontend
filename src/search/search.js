const React = require('react');
const ReactDOM = require('react-dom');
const SearchMap = require('./components/search-map.react');
const SearchContainer = require('./components/search-container.react');
const i18n = require('i18n');


if ($('#search-container').length) {
  i18n.loadNamespaces(['languages','common', 'homes'],function(){
    // Search parent
    ReactDOM.render(
      <SearchContainer />, document.querySelector('#search-container')
    )
  });
}
