const React = require('react')
const ReactDOM = require('react-dom')
const PhotoModule = require('./photo-module.react')

const JWT = require('JWT')
const domains = require('domains')

const i18n = require('i18n')

const toast = require('toast')

const Dropzone = require('dropzone')
Dropzone.autoDiscover = false;

module.exports = React.createClass({
  componentDidMount: function() {

    var refreshState = this.props.refreshState;

    var drop = "#home-image-upload"

    window.homePhotoDrop = new Dropzone('#home-image-upload', {
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

      console.log(domains)

      for (var i=0; i<photos.length; i++) {
        var newPhoto = {
          name: photos[i],
          size: 0
        }
        homePhotoDrop.options.addedfile.call(homePhotoDrop, newPhoto)
        homePhotoDrop.options.thumbnail.call(homePhotoDrop, newPhoto, domains.IMG + photos[i])
      }

      console.log(photos)

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
