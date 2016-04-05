var React = require('react');
var ReactDOM = require('react-dom');
var PhotoModule = require('./photo-module.react')

module.exports = React.createClass({
  componentDidUpdate: function() {
    if (this.props.props.photos) {

      var refreshState = this.props.refreshState;
      var photos = this.props.props.photos;

      var PhotoContainer = React.createClass({
        render: function() {
          var allPhotos = []
          photos.forEach(function(url) {
            allPhotos.push(
              <PhotoModule
                src={url}
                key={url}
                refreshState={refreshState}
              />
            )
          })
          return (
            <div>{allPhotos}</div>
          )
        }
      })

      ReactDOM.render(
        <PhotoContainer
        />, document.querySelector('#photos-container')
      );
    }
  },
  render: function() {

    return (
      <div></div>
    );
  }
});
