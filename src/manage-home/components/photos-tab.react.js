const React = require('react')
const ReactDOM = require('react-dom')
const PhotoModule = require('./photo-module.react')

const JWT = require('JWT')
const domains = require('JWT')

const Dropzone = require('dropzone')
Dropzone.autoDiscover = false;

module.exports = React.createClass({
  componentDidMount: function() {

    var drop = "#home-image-upload"

    $('#home-image-upload').dropzone({
      url: '/upload/users/'+JWT.rid+'/homes/'+JWT.hid+'/photos',
      headers: {'abroadauth': 'Bearer ' + JWT},
      addRemoveLinks: true,
      maxFilesize: 10,
      acceptedFiles: 'image/jpeg,image/png',
      dictRemoveFile: 'Delete',
      removedfile: function(file) {
        console.log(file)
      }
    })

  },
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
