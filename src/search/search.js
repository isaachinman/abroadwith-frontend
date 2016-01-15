// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var SearchList = require('./components/searchList.react');
var Nouislider = require('react-nouislider');

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
  var priceMin = 0;
  var priceMax = 2000;

  ReactDOM.render(
    <Nouislider
      range={{min: 0, max: 2000}}
      margin={100}
      start={[1200, 1800]}
      tooltips
    />, document.querySelector('#price-slider')
  );
}
