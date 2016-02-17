var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  deletePhoto: function() {

    // Send deletion request to API, then reload state upon success
    Materialize.toast('Photo deleted', 4000);

  },
  render: function() {
    return (

      <div className="col s12 m6 l4">
        <div className="card home-photo">
          <div className="card-image">
            <img src={this.props.src}></img>
          </div>
          <a className='delete' onClick={this.deletePhoto}><i className="fa fa-times fa-2x"></i></a>
        </div>
      </div>

    );
  }
});
