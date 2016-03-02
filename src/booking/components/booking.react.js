var React = require('react');
var ReactDOM = require('react-dom');

require('../scrollspy');
$('.scrollspy').scrollSpy();

var i18n = require('../../global/components/i18n');
i18n.loadNamespaces(['booking']);

var domains = require('domains');
var jwt_decode = require('jwt-decode');

module.exports = React.createClass({
  requestBooking: function() {

  },
  calculateNewPrice: function() {

  },
  refreshState: function() {
    var newState = {
      // Conditionally set up state per category
      arrival:            $('#arrival').attr('data-value'),
      departure:          $('#departure').attr('data-value')

    }
    if (this.isMounted()) {
      this.setState(newState);
    }
  },
  componentDidMount: function() {

    // Extra guests equals number of guests minus one
    $('select#EXTRA_GUEST').val($('#guest-count').attr('data-guests') - 1);

    // Modify UI to match query params
    function setQueriedValue(name) {
      if ($('select#'+name).attr('data-value') !== '') {
        $('select#'+name).val($('select#'+name).attr('data-value'));
      }
    }

    // List of potential url queries
    var potentialQueries = [
      "learning",
      "booking-immersions",
      "meal_plan",
      "meal_pref",
      "diet_restrictions",
      "course"
    ];

    // Set input values to url query values
    potentialQueries.forEach(setQueriedValue);

    $('select#booking-immersions').change(function() {
      if ($(this).val() === 'stay') {
        // Hide and show for tandem
        $('.immersion-field').hide();
        $('.stay-field:not(select)').show();
        console.log('show stay')
      } else if ($(this).val() === 'tandem') {
        // Hide and show for tandem
        $('.immersion-field').hide();
        $('.tandem-field:not(select)').show();
      } else if ($(this).val() === 'teacher') {
        // Hide and show for teacher
        $('.immersion-field').hide();
        $('.teacher-field:not(select)').show();
      }
    })

    $('.immersion-field').hide();
    $('select#booking-immersions').trigger('change');

  },
  componentDidUpdate: function() {

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
