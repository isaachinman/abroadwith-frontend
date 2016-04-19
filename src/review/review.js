const React = require('react');
const ReactDOM = require('react-dom');
const ReviewContainer = require('./components/review-container.react')


if ($('#review-container').length) {
  // Trips parent
  ReactDOM.render(
    <ReviewContainer />, document.querySelector('#review-container')
  )
}
