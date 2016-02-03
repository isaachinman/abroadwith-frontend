var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  handleClick: function() {

    // Send deletion request to API, then reload state upon success

  },
  render: function() {
    return (

      <div className="col s12 m6 l4">
        <div className="card home-photo">
          <div className="card-image">
            <img src={this.props.src}></img>
          </div>
          <a className='delete' onClick={this.handleClick}><i className="fa fa-times fa-2x"></i></a>
        </div>
      </div>

    );
  }
});
