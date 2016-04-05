var React = require('react');
var toast = require('toast');

module.exports = React.createClass({
  saveDescription: function() {

    var newHomeObj = this.props.props;

    // Create new description object
    newHomeObj.description.summary = $('#summary').val();
    newHomeObj.description.rules = $('#rules').val();
    newHomeObj.description.neighbourhood = $('#neighbourhood').val();
    newHomeObj.description.video = 'https://' + ($('#video').val()).replace(/.*?:\/\//g, "");

    this.props.updateHome(newHomeObj, function() {
      toast('Description updated');
    });

  },
  componentDidMount: function() {
    $('#save-description').click(this.saveDescription);
  },
  componentDidUpdate: function() {

    if (this.props.props.description) {
      $('#summary').val(this.props.props.description.summary);
      $('#rules').val(this.props.props.description.rules);
      $('#neighbourhood').val(this.props.props.description.neighbourhood);
      $('#video').val(this.props.props.description.video);
    }

  },
  render: function() {

    return (

      <div></div>

    );
  }
});
