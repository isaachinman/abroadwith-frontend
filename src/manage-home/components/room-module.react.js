const React = require('react');
const i18n = require('i18n');
const room = require('../../global/constants/Room');

const Dropzone = require('dropzone')

const domains = require('domains');
const JWT = require('JWT');

var compileBedTypes = function(){
  var options = [];
  for(var bed in room.bedType){
    options.push(<option value={bed}>{i18n.t('rooms:bed_types.'+bed)}</option>);
  }
  return options;
}

var compileFacilities = function(){
  var options = [];
  for(var facility in room.facilities){
    options.push(<option value={facility}>{i18n.t('rooms:facilities.'+facility)}</option>);
  }
  return options;
}

module.exports = React.createClass({
  deleteRoom: function() {

    $('#preloader').show();

    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/homes/'+JWT.hid+'/rooms/'+this.props.id,
      type: "DELETE",
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function() {

        this.props.refreshState();

        $('#preloader').hide();

      }.bind(this),
      error: function(response) {

        if (response.status === 409) {
          $('#room-deletion-failure').openModal()
        }

        $('#preloader').hide();

      }
    })

  },
  componentDidMount: function() {

    $('li[data-id="'+this.props.id+'"]').find('select.bed-type option[value="'+this.props.bed+'"]').attr('selected','selected');
    $('li[data-id="'+this.props.id+'"]').find('select.facilities').val(this.props.facilities);
    $('li[data-id="'+this.props.id+'"]').find('select.vacancies option[value="'+this.props.vacancies+'"]').attr('selected','selected');
    $('li[data-id="'+this.props.id+'"]').find('select.material').material_select();

    var id = this.props.id
    var rooms = this.props.props.rooms

    var dropzone = new Dropzone('#upload-photo-room-'+id, {
      url: '/upload/users/'+JWT.rid+'/homes/'+JWT.hid+'/rooms/'+$('#upload-photo-room-'+id).attr('data-room-id')+'/photo',
      autoProcessQueue: true,
      addRemoveLinks: true,
      maxFiles: 1,
      method: 'post',
      dictDefaultMessage: i18n.t('common:drop_files_here'),
      dictRemoveFile: i18n.t('manage_home:delete'),
      headers: {'abroadauth': 'Bearer ' + localStorage.getItem('JWT')},
      maxFilesize: 10,
      acceptedFiles: 'image/jpeg,image/png',
      init: function() {
        this.on('success', function(x, serverResponse) {
          var parsedResponse = JSON.parse(serverResponse)
          console.log(serverResponse)
          $.each(rooms, function(index, room) {
            if (room.id === id) {
              room.img = serverResponse.location
            }
          })
        })
      }
    })

    if (this.props.img) {
      var newPhoto = {
        name: this.props.img,
        size: 0
      }
      dropzone.options.addedfile.call(dropzone, newPhoto)
      dropzone.options.thumbnail.call(dropzone, newPhoto, domains.IMG + this.props.img + '?w=120&h=120&fit=crop&crop=entropy')
      dropzone.options.complete.call(dropzone, newPhoto)
    }

  },
  render: function() {

    var img = this.props.img !== null ? this.props.img : '';
    var canDelete = this.props.canDelete ? <a className='red-text' onClick={this.deleteRoom}>{i18n.t('manage_home:rooms_delete')}</a> : null

    return (

      <li className='white existing-room' data-id={this.props.id} data-price={this.props.price}>
        <div id={this.props.id} className="collapsible-header">
          {this.props.roomName}
        </div>
        <div className="edit grey-text text-lighten-1">
          <i className="fa fa-pencil fa-2x"></i>
        </div>
        <div className="collapsible-body">

          <div className='row section'>
            <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
              <i className="fa fa-tag fa-2x"></i>
            </div>
            <div className="col s10 m4 l4 input-field">
              <input type="text" className="validate room-name" placeholder={i18n.t('rooms:room_name_placeholder')} length='35' maxlength='35' defaultValue={this.props.roomName} />
              <label htmlFor="room-name" className='active'>{i18n.t('rooms:room_name_label')}</label>
            </div>
            <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
              <i className="fa fa-bed fa-2x"></i>
            </div>
            <div className='col s10 m6 l6 input-field'>
              <select className='material bed-type' value={this.props.bed}>
                <option value="" disabled>{i18n.t('rooms:bed_types_placeholder')}</option>
                {compileBedTypes()}
              </select>
              <label>{i18n.t('rooms:bed_types_label')}</label>
            </div>
          </div>

          <div className='divider'></div>

          <div className='row section'>
            <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
              <i className="fa fa-user-plus fa-2x"></i>
            </div>
            <div className='col s10 m4 l4 input-field'>
              <select className='material vacancies' value={this.props.vacancies}>
                <option value="" disabled>{i18n.t('rooms:vacancies_placeholder')}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <label>{i18n.t('rooms:vacancies_label')}</label>
            </div>
            <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
              <i className="fa fa-lock fa-2x"></i>
            </div>
            <div className='col s10 m6 l6 input-field'>
              <select className='material facilities' multiple>
                <option value="" disabled>{i18n.t('rooms:facilities_placeholder')}</option>
                {compileFacilities()}
              </select>
              <label>{i18n.t('rooms:facilities_label')}</label>
            </div>
          </div>

          <div className='divider'></div>

          <div className='row section'>

            <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
              <i className="fa fa-users fa-2x"></i>
            </div>
            <div className='col s10 m4 l4 left-align'>
              <label>{i18n.t('rooms:shared_label')}</label>
              <div className="switch">
                <label>
                  {i18n.t('common:words.No')}
                  <input type="checkbox" className='shared-switch' checked={this.props.shared} />
                  <span className="lever"></span>
                  {i18n.t('common:words.Yes')}
                </label>
              </div>
            </div>

            <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
              <i className="fa fa-camera-retro fa-2x"></i>
            </div>
            <div className='col s10 m6 l6 input-field'>
              <div data-room-id={this.props.id} className='upload-room-photo dropzone' id={'upload-photo-room-'+this.props.id}></div>
            </div>
          </div>

          <div className='divider'></div>

          <div className='row section'>
            <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
              <i className="fa fa-file-text-o fa-2x"></i>
            </div>
            <div className="col s10 m11 l11 input-field">
              <textarea className="materialize-textarea room-description" length='255' maxlength='255' placeholder={i18n.t('rooms:description_placeholder')} defaultValue={this.props.description}></textarea>
              <label htmlFor="room-description" className='active'>{i18n.t('manage_home:Description')}</label>
            </div>
          </div>

          <div className='row'>
            <div className='col s12 right-align'>
              {canDelete}
            </div>
          </div>

        </div>
      </li>

    );
  }
});
