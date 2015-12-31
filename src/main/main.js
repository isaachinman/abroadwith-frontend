var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

// Tap events
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

// Modal deps
var modal = require('react-modal');
var HowDoesItWork = require('./components/how-does-it-work.react');

// Datepicker deps
var DatePicker = require('material-ui/lib/date-picker/date-picker');
var DatePickerDialog = require('material-ui/lib/date-picker/date-picker-dialog');

// Select deps
var SelectField = require('material-ui/lib/select-field');

// Datepicker styles
var datepickerStyle = {
  marginTop: '5px',
  marginLeft: '10px',
  fontWeight: 400,
  fontSize: '1rem',
  width: '100px',
  height: '36px',
  color: '#9E9E9E',
  border: 'none'
}

// Select menu items
var menuItems = [
  { payload: '1', text: '1' },
  { payload: '2', text: '2' },
  { payload: '3', text: '3' },
  { payload: '4', text: '4' },
  { payload: '5', text: '5' }
];

// Render modal
ReactDOM.render(
  <HowDoesItWork />,
  document.getElementById('how-does-it-work')
);

// Render arrival datepicker
ReactDOM.render(
  <DatePicker
  hintText='Arrival'
  textFieldStyle ={datepickerStyle}
  />,
  document.getElementById('arrival')
);

// Render checkout datepicker
ReactDOM.render(
  <DatePicker
  hintText='Checkout'
  textFieldStyle ={datepickerStyle}
  />,
  document.getElementById('checkout')
);
