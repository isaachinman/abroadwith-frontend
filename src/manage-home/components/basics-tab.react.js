var React = require('react');
var toast = require('toast');

module.exports = React.createClass({
  saveBasics: function() {

    // Create new basics object
    homeObj.basics.homeType = $('#home-type').val();
    homeObj.basics.SAFETY = $('#safety').val();
    homeObj.basics.AMENITIES = $('#amenities').val();
    homeObj.basics.FOOD_OPTION = $('#food-option').val();
    homeObj.basics.EXTRAS = $('#extras').val();
    homeObj.basics.family = $('#family').prop('checked');
    homeObj.basics.PREFERENCES = $('#preferences').val();

    this.props.updateHome(function() {
      toast('Basics updated');
    });

  },
  componentDidMount: function() {
    $('a#save-basics').click(this.saveBasics);
  },
  componentDidUpdate: function() {

    if (this.props.basics) {

      // Set input values
      $('#home-type').val(this.props.basics.homeType);
      $('#safety').val(this.props.basics.SAFETY)
      $('#amenities').val(this.props.basics.AMENITIES)
      $('#food-option').val(this.props.basics.FOOD_OPTION)
      $('#extras').val(this.props.basics.EXTRAS)
      $('#family').prop('checked', this.props.basics.family);
      $('#preferences').val(this.props.basics.PREFERENCES)

    }

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
