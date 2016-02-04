var React = require('react');
var PhotoModule = require('./photo-module.react')

module.exports = React.createClass({
  render: function() {
    if (this.props.photos) {

      var photos = this.props.photos.map(function(url) {
        return <PhotoModule src={url} key={url} />
      })

    }
    return (

      <div id="photos" className="col s12 m10 offset-m1 l10 offset-l1">

        <div className='manage-home-block'>

          <div className='row'>
            <h4>Bring your home to life with photos</h4>
          </div>

          <div className='manage-home-section'>

            <div className='row section'>
              <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
                <i className="fa fa-camera-retro fa-2x"></i>
              </div>
              <div className="col s8 m9 l9">
                <form action="#">
                  <div className="file-field input-field">
                    <div className="btn">
                      <span><small>Choose picture</small></span>
                      <input type="file" />
                    </div>
                    <div className="file-path-wrapper">
                      <input className="file-path validate" type="text" />
                    </div>
                  </div>
                </form>
              </div>
              <div className='col s2 input-field'>
                <a className='btn-floating'>+</a>
              </div>
            </div>


          </div>

          <div className='row'></div>

          <div className='manage-home-section'>

            <div className='row manage-home-photos'>

              {photos}

            </div>

          </div>

        </div>

        <div className='row'>
          <div className='col s6 offset-s3'>
            <a id='photos-save' className='btn btn-primary save-btn'>Save</a>
          </div>
          <div className='col s3 right-align'>
            <a><i className="fa fa-chevron-right grey-text text-lighten-1 next-btn"></i></a>
          </div>
        </div>

      </div>

    );
  }
});
