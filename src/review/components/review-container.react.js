var React = require('react');
var Rating = require('rating');

var jwt_decode = require('jwt-decode');
var domains = require('domains');

// Component export
module.exports = React.createClass({
  componentDidMount: function() {

    var newState = {
      revieweeType: $('#reviewee').attr('data-type'),
      revieweeId: parseInt($('#reviewee').attr('data-id')),
      rating: null,
      description: null
    }

    this.setState(newState, function() {
      console.log(this.state)
    });

    // Send review button
    var sendReview = this.sendReview;
    $('a#send-review').click(function() {
      sendReview();
    });

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

    var reviewValid = false;

    if ($('textarea#review').val().length >= 20 && this.state.rating !== null) {
      reviewValid = true;
    }

    if (reviewValid === true && $('a#send-review').hasClass('disabled')) {
      $('a#send-review').removeClass('disabled');
    } else if (reviewValid === false && !($('a#send-review').hasClass('disabled'))) {
      $('a#send-review').addClass('disabled');
    }

  },
  sendReview: function() {

    $('#preloader').show();

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;

    var reviewObj = this.state;
    reviewObj.description = $('textarea#review').val();
    console.log(reviewObj);

    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/reviews',
      type: "POST",
      data: JSON.stringify(reviewObj),
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {

        $('#preloader').hide();

        console.log(response)

      },
      error: function() {

        alert('Something failed');

      }
    })

  },
  render: function() {
    return (
      <div></div>
    );
  }
});
