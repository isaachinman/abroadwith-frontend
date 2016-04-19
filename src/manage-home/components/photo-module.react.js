const React = require('react');
const ReactDOM = require('react-dom');
const i18n = require('i18n');

const toast = require('toast');

const domains = require('domains');
const JWT = require('JWT');
const DELETE = require('DELETE');

module.exports = React.createClass({
  deletePhoto: function() {

    $('#preloader').show();

    var deletePhotoObj = {
      images: [
        {
          pathName: this.props.src
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

        this.props.refreshState();
        $('#preloader').hide();
        toast(i18n.t('manage_home:photo_deleted_toast'), 4000)

      }.bind(this),
      error: function() {

        $('#preloader').hide();
        alert('Something failed');

      }
    })


  },
  componentDidMount: function() {
    $('.tooltipped').tooltip();
  },
  render: function() {

    var photoSrc = domains.IMG + this.props.src;

    return (

      <div className="col s12 m6 l4">
        <div className="card home-photo">
          <div className="card-image">
            <img src={photoSrc}></img>
          </div>
          <a className='delete tooltipped' data-position="bottom" data-delay="50" data-tooltip={i18n.t('manage_home:delete_photo_tooltip')} onClick={this.deletePhoto}><i className="fa fa-times fa-2x"></i></a>
        </div>
      </div>

    );
  }
});
