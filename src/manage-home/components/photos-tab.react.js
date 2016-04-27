const React = require('react')
const ReactDOM = require('react-dom')
const PhotoModule = require('./photo-module.react')

const JWT = require('JWT')
const domains = require('domains')

const i18n = require('i18n')

const toast = require('toast')

const Dropzone = require('dropzone')
Dropzone.autoDiscover = false

module.exports = React.createClass({
  componentDidMount: function() {

    var refreshState = this.props.refreshState;

    window.homePhotoDrop = new Dropzone('#home-image-upload', {
      url: '/upload/users/'+JWT.rid+'/homes/'+JWT.hid+'/photos',
      autoProcessQueue: true,
      method: 'post',
      headers: {'abroadauth': 'Bearer ' + localStorage.getItem('JWT')},
      addRemoveLinks: true,
      maxFilesize: 10,
      dictRemoveFile: i18n.t('manage_home:delete'),
      acceptedFiles: 'image/jpeg,image/png',
      init: function() {
        this.on('removedfile', function(file) {

          $('#preloader').show();

          var deletePhotoObj = {
            images: [
              {
                pathName: file.name
              }
            ]
          }

          $.ajax({
            type: "DELETE",
            url: domains.API + '/users/' + JWT.rid + '/homes/' + JWT.hid + '/photos',
            contentType: "application/json",
            data: JSON.stringify(deletePhotoObj),
            beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
            success: function(response) {

              $('#preloader').hide();
              toast(i18n.t('manage_home:photo_deleted_toast'), 4000)

            }.bind(this),
            error: function() {

              $('#preloader').hide();
              alert('Something failed');

            }
          })

        })
      }
    })

  },
  componentDidUpdate: function() {

    if (this.props.props.photos) {

      $('#home-image-upload').find('.dz-preview').remove()

      var refreshState = this.props.refreshState;
      var photos = this.props.props.photos;

      console.log(photos)

      for (var i=0; i<photos.length; i++) {
        var newPhoto = {
          name: photos[i],
          size: 0
        }
        homePhotoDrop.options.addedfile.call(homePhotoDrop, newPhoto)
        homePhotoDrop.options.thumbnail.call(homePhotoDrop, newPhoto, domains.IMG + photos[i])
        homePhotoDrop.options.complete.call(homePhotoDrop, newPhoto)
      }

    }

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
