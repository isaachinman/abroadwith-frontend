// Deps
var React = require('react');
var ReactDOM = require('react-dom');

if ($('#review-container').length) {
  // Trips parent
  ReactDOM.render(
    <ReviewContainer />, document.querySelector('#review-container')
  )
}
