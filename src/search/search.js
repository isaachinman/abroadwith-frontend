var React = require('react');
var ReactDOM = require('react-dom');
var SearchList = require('./components/searchList.react');
var Nouislider = require('react-nouislider');

ReactDOM.render(
  <SearchList />,
  document.getElementById('content-search')
);

ReactDOM.render(
  <Nouislider
    range={{min: 0, max: 2000}}
    start={[1200, 1800]}
    tooltips
  />, document.querySelector('#price-slider')
);

// Booking datepicker
$(document).ready(function() {
  if ($('.datepicker').length) {
    $('.datepicker').pickadate({
      min: 1,
      onSet: function () {
        this.close();
      }
    });
  }
})
