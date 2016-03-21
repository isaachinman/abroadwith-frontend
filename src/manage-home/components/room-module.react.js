var React = require('react');
var i18n = require('../../global/components/i18n');
var room = require('../../global/constants/Room');

var domains = require('domains');
var JWT = require('JWT');

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

    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/homes/'+JWT.hid+'/rooms/'+this.props.id,
      type: "DELETE",
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function() {

        this.props.refreshState();

        $('#preloader').hide();

      }.bind(this),
      error: function() {

        $('#preloader').hide();
        alert('Something failed');

      }
    })

  },
  componentDidMount: function() {
    $('li[data-id="'+this.props.id+'"]').find('select.bed-type option[value="'+this.props.bed+'"]').attr('selected','selected');
    $('li[data-id="'+this.props.id+'"]').find('select.facilities').val(this.props.facilities);
    $('li[data-id="'+this.props.id+'"]').find('select.material').material_select();
  },
  render: function() {

    console.log(this.props)
    var img = this.props.img ? this.props.img : '';

    return (

      <li className='white existing-room' data-id={this.props.id}>
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
              <input type="text" className="validate room-name" placeholder={i18n.t('rooms:room_name_placeholder')} length='35' defaultValue={this.props.roomName} />
              <label htmlFor="room-name" className='active'>{i18n.t('rooms:room_name_label')}</label>
            </div>
            <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
              <i className="fa fa-bed fa-2x"></i>
            </div>
            <div className='col s12 m6 l6 input-field'>
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
              <select className='material vacancies' defaultValue={this.props.vacancies}>
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
            <div className='col s5 m4 l4 left-align'>
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
            <div className='col s10 m6 l6 left-align'>
              <form action="#">
                <div className="file-field input-field">
                  <div className="btn">
                    <span>
                      <small>Choose picture</small>
                    </span>
                    <input roomid={this.props.id} className='upload-room-photo' style={this.props.inputstyle} id={'upload_photo_room_'+this.props.id} name="file" type="file" />

                  </div>
                  <div className="file-path-wrapper">
                    <input id={'photo_room_'+this.props.id} type="text" defaultValue={this.props.img} disabled/>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className='divider'></div>

          <div className='row section'>
            <div className='col s2 m1 l1 input-field center-align grey-text text-lighten-1'>
              <i className="fa fa-file-text-o fa-2x"></i>
            </div>
            <div className="col s10 m11 l11 input-field">
              <textarea className="materialize-textarea room-description" length='127' placeholder={i18n.t('rooms:description_placeholder')} defaultValue={this.props.description}></textarea>
              <label htmlFor="room-description" className='active'>{i18n.t('manage_home:Description')}</label>
            </div>
          </div>

          <div className='row'>
            <div className='col s12 right-align'>
              <a className='red-text' onClick={this.deleteRoom}>Delete room</a>
            </div>
          </div>

        </div>
      </li>

    );
  }
});
