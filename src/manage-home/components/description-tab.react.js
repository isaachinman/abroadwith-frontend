var React = require('react');

module.exports = React.createClass({
  saveDescription: function() {

    // Create new description object
    var newDescriptionObj = {};
    newDescriptionObj.summary = $('#summary').val();
    newDescriptionObj.rules = $('#rules').val();
    newDescriptionObj.neighbourhood = $('#neighbourhood').val();
    newDescriptionObj.video = $('#video').val();

    // Modify home object, using new description object
    if (typeof homeObj !== 'undefined') {
      homeObj.description = newDescriptionObj;
      console.log(newDescriptionObj)

      // POST new home object
      Materialize.toast('Description updated', 4000);
    }

  },
  componentDidUpdate: function() {

    if (this.props.description) {
      $('#summary').val(this.props.description.summary);
      $('#rules').val(this.props.description.rules);
      $('#neighbourhood').val(this.props.description.neighbourhood);
      $('#video').val(this.props.description.video);
    }

    $('#save-description').click(this.saveDescription);

  },
  render: function() {

    return (

      <div></div>

    );
  }
});
