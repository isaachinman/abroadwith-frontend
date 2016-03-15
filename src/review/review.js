// Deps
var React = require('react');
var ReactDOM = require('react-dom');
var ReviewContainer = require('./components/review-container.react')


if ($('#review-container').length) {
  // Trips parent
  ReactDOM.render(
    <ReviewContainer />, document.querySelector('#review-container')
  )
}
