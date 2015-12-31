var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

// Modal deps
var modal = require('react-modal');
var HowDoesItWork = require('./components/how-does-it-work.react');

// Datepicker deps
var DatePicker = require('./components/datepicker.react');

ReactDOM.render(
  <HowDoesItWork />,
  document.getElementById('how-does-it-work')
);

// ReactDOM.render(
//   <DatePicker />,
//   document.getElementById('datepicker')
// );
