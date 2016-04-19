const React = require('react');
const Rating = require('rating');

const domains = require('domains');
const JWT = require('JWT');
const POST = require('POST');

// Component export
module.exports = React.createClass({
  componentDidMount: function() {

    var newState = {
      revieweeType: $('#reviewee').attr('data-type'),
      revieweeId: parseInt($('#reviewee').attr('data-id')),
      rating: null,
      description: null
    }

    this.setState(newState);

    // Send review button
    $('a#send-review').click(function() {
      this.sendReview();
    }.bind(this));

    // Initialise star rating
    var container = document.querySelector('.rating');
    var star = document.querySelector('.star');
    star.parentNode.removeChild(star);

    var rating = new Rating([1, 2, 3, 4, 5], {
      container: container,
      star: star
    });

    var validateReview = this.validateReview;

    $('textarea#review').keyup(function() {
      validateReview();
    })

    rating.on('rate', function(rating) {
      var newState = this.state;
      newState.rating = rating;
      this.setState(newState, function() {
        validateReview();
      });
    }.bind(this));

  },
  validateReview: function() {

    if ($('textarea#review').val().length >= 20 && this.state.rating !== null) {
      $('a#send-review').hasClass('disabled') ? $('a#send-review').removeClass('disabled') : null;
    } else {
      $('a#send-review').hasClass('disabled') ? null : $('a#send-review').addClass('disabled');
    }

  },
  sendReview: function() {

    $('#preloader').show();

    var reviewObj = this.state;
    reviewObj.description = $('textarea#review').val();

    var url = domains.API+'/users/'+JWT.rid+'/reviews';
    var success = function() {
      $('#preloader').hide();
    }
    POST(url, reviewObj, success);

  },
  render: function() {
    return (
      <div></div>
    );
  }
});
