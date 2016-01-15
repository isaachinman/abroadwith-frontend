// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var SearchList = require('./components/searchList.react');
var Nouislider = require('react-nouislider');
require('wnumb');

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
