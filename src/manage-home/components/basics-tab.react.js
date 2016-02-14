var React = require('react');

module.exports = React.createClass({
  saveBasics: function() {

    // Create new basics object
    var newBasicsObj = {};
    newBasicsObj.homeType = $('#home-type').val();
    newBasicsObj.SAFETY = $('#safety').val();
    newBasicsObj.AMENITIES = $('#amenities').val();
    newBasicsObj.MEAL_PLAN = $('#meal-plan').val();
    newBasicsObj.FOOD_OPTION = $('#food-option').val();
    newBasicsObj.EXTRAS = $('#extras').val();
    newBasicsObj.family = $('#family').prop('checked');
    newBasicsObj.PREFERENCES = $('#preferences').val();

    // Modify home object, using new basics object
    if (typeof homeObj !== 'undefined') {
      console.log(newBasicsObj)
      homeObj.basics = newBasicsObj;
    }

    // POST new home object
    Materialize.toast('Basics updated', 4000);

  },
  componentDidUpdate: function() {

    if (this.props.basics) {

      console.log(this.props.basics)

      // Set input values
      $('#home-type').val(this.props.basics.homeType);
      $('#safety').val(this.props.basics.SAFETY)
      $('#amenities').val(this.props.basics.AMENITIES)
      $('#meal-plan').val(this.props.basics.MEAL_PLAN)
      $('#food-option').val(this.props.basics.FOOD_OPTION)
      $('#extras').val(this.props.basics.EXTRAS)
      $('#family').prop('checked', this.props.basics.family);
      $('#preferences').val(this.props.basics.PREFERENCES)

      // Refresh selects
      $('#home-type').material_select();
      $('#safety').material_select();
      $('#amenities').material_select();
      $('#meal-plan').material_select();
      $('#food-option').material_select();
      $('#extras').material_select();
      $('#preferences').material_select();


    }

    $('a#save-basics').click(this.saveBasics);

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
