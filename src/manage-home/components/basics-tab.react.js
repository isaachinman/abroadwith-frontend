var React = require('react');

module.exports = React.createClass({
  saveBasics: function() {

    console.log(counter);
    counter++;

    // Create new basics object
    var newBasicsObj = {};
    newBasicsObj.homeType = $('#home-type').val();
    newBasicsObj.SAFETY = $('#safety').val();
    newBasicsObj.AMENITIES = $('#amenities').val();
    newBasicsObj.MEAL_PLAN = $('#meal-plan').val();
    newBasicsObj.FOOD_OPTION = $('#food-option').val();
    newBasicsObj.EXTRAS = $('#extras').val();
    newBasicsObj.family = $('#family').val();
    newBasicsObj.PREFERENCES = $('#preferences').val();

    // Modify home object, using new basics object
    if (typeof homeObj !== 'undefined') {
      homeObj.basics = newBasicsObj;
      console.log(homeObj);
    }

    // POST new home object
    Materialize.toast('Basics updated', 4000);

  },
  componentDidMount: function() {

  },
  render: function() {

    if (this.props.basics) {

      $('#home-type').val(this.props.basics.homeType);
      $('#safety').val(this.props.basics.SAFETY)
      $('#amenities').val(this.props.basics.AMENITIES)
      $('#meal-plan').val(this.props.basics.MEAL_PLAN)
      $('#food-option').val(this.props.basics.FOOD_OPTION)
      $('#extras').val(this.props.basics.EXTRAS)
      $('#family').prop('checked', this.props.basics.family);
      $('#preferences').val(this.props.basics.PREFERENCES)

    }

    $('a#save-basics').click(this.saveBasics);

    return (
      <div></div>
    );
  }
});
