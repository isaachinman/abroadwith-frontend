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

ReactDOM.render(
  <HowDoesItWork />,
  document.getElementById('how-does-it-work')
);

ReactDOM.render(
  <DatePicker hintText="Arrival" />,
  document.getElementById('arrival')
);
