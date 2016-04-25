const React = require('react')
const ReactDOM = require('react-dom')
const PhotoModule = require('./photo-module.react')

const JWT = require('JWT')
const domains = require('JWT')

const i18n = require('i18n')

const toast = require('toast')

const Dropzone = require('dropzone')
Dropzone.autoDiscover = false;

module.exports = React.createClass({
  componentDidMount: function() {

    var refreshState = this.props.refreshState;

    var drop = "#home-image-upload"

    $('#home-image-upload').dropzone({
      url: '/upload/users/'+JWT.rid+'/homes/'+JWT.hid+'/photos',
      autoProcessQueue: true,
      method: 'post',
      headers: {'abroadauth': 'Bearer ' + localStorage.getItem('JWT')},
      addRemoveLinks: true,
      maxFilesize: 10,
      acceptedFiles: 'image/jpeg,image/png',
      init: function() {
        this.on('processingfile', function(file) {
          file.name = 'justin-bieber.jpg';
        });
        this.on('sending', function( one, two, three ){
          two.withCredentials = true
          console.log( one );
          console.log( two );
          console.log( three );
        });
        this.on("addedfile", function(file) {
          console.log(file)
        });
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
