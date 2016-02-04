var React = require('react');

module.exports = React.createClass({
  handleClick: function() {

    // Create new description object
    var newDescriptionObj = {};
    newDescriptionObj.summary = $('#summary').val();
    newDescriptionObj.rules = $('#rules').val();
    newDescriptionObj.neighbourhood = $('#neighbourhood').val();
    newDescriptionObj.video = $('#video').val();

    // Modify home object, using new description object
    if (typeof homeObj !== 'undefined') {
      homeObj.description = newDescriptionObj;
      console.log(homeObj)
    }

    // POST new home object
    Materialize.toast('Description updated', 4000);

  },
  render: function() {

    if (this.props.description) {
      $('#summary').val(this.props.description.summary);
      $('#rules').val(this.props.description.rules);
      $('#neighbourhood').val(this.props.description.neighbourhood);
      $('#video').val(this.props.description.video);
    }

    return (

      <div id="description" className="col s12 m10 offset-m1 l10 offset-l1">

        <div className='manage-home-block'>

          <div className='row'>
            <h4>Let guests know what to expect</h4>
          </div>

          <div className='manage-home-section'>

            <div className='row section'>
              <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                <i className="fa fa-home fa-2x"></i>
              </div>
              <div className="input-field col s10 m11 l11">
                <textarea id="summary" className="materialize-textarea" length='255' placeholder='Tell us about your home'></textarea>
                <label htmlhtmlFor="summary">Summary</label>
              </div>
            </div>

            <div className='divider'></div>

            <div className='row section'>

              <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                <i className="fa fa-exclamation-circle fa-2x"></i>
              </div>
              <div className="input-field col s10 m3 l3">
                <textarea id="rules" className="materialize-textarea" length='127' placeholder='Do you have any house rules?'></textarea>
                <label htmlFor="rules">Rules</label>
              </div>

              <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                <i className="fa fa-building-o fa-2x"></i>
              </div>
              <div className="input-field col s10 m3 l3">
                <textarea id="neighbourhood" className="materialize-textarea" placeholder='Tell us about the surrounding area' length='127'></textarea>
                <label htmlFor="neighbourhood">Neighbourhood</label>
              </div>

              <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                <i className="fa fa-youtube fa-2x"></i>
              </div>
              <div className="input-field col s10 m3 l3">
                <input id="video" type="text" className="validate" placeholder='Walkthrough video' />
                <label htmlFor="video">YouTube link</label>
              </div>

            </div>

          </div>

        </div>

        <div className='row'>
          <div className='col s6 offset-s3'>
            <a id='description-save' className='btn btn-primary save-btn' onClick={this.handleClick}>Save</a>
          </div>
          <div className='col s3 right-align'>
            <a><i className="fa fa-chevron-right grey-text text-lighten-1 next-btn"></i></a>
          </div>
        </div>

      </div>

    );
  }
});
