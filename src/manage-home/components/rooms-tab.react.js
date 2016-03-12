var React = require('react');
var ReactDOM = require('react-dom');
var RoomModule = require('./room-module.react');
var i18n = require('../../global/components/i18n');

var jwt_decode = require('jwt-decode');
var domains = require('domains');
var toast = require('toast');

i18n.loadNamespaces('manage_home');

module.exports = React.createClass({
  addRoom: function() {

    var newRoom = {};
    newRoom.name = $('#room-name').val();
    newRoom.description = $('#room-description').val();
    newRoom.vacancies = $('#room-vacancies').val();
    newRoom.shared = $('#room-shared').prop('checked');
    newRoom.bed = $('#room-bed').val();
    newRoom.facilities = $('#room-facilities').val();

    console.log(newRoom)

    var JWT = localStorage.getItem('JWT') !== null ? jwt_decode(localStorage.getItem('JWT')) : null;
    $('#preloader').show();
    $.ajax({
      url: domains.API+'/users/'+JWT.rid+'/homes/'+JWT.hid+'/rooms',
      type: "POST",
      data: JSON.stringify(newRoom),
      contentType: "application/json",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'))},
      success: function(response) {
        console.log(response);

        var thisprops = this.props;
        var file = $('#new_room_photo')[0].files;
        if(file){
          var formData = new FormData();
          for(var f = 0; f < file.length; f++){
            formData.append('photos', file[f]);
          }
          $.ajax({
            url : '/upload/users/'+JWT.rid+'/homes/'+JWT.hid+'/rooms/'+response.roomId+'/photo',
            type : 'POST',
            data : formData,
            cache : false,
            contentType : false,
            processData : false,
            beforeSend: function(xhr){xhr.setRequestHeader('abroadauth', 'Bearer ' + localStorage.getItem('JWT'))},
            success : function(data, textStatus, jqXHR) {
                  thisprops.refreshState();
                  $('#add-room-form .collapsible-header').trigger('click');
                  $('#add-room-form input, select, textarea').val(null);
                  $('#preloader').hide();
            },
            error: function(jqXHR) {
              var message = jqXHR.responseText;
              alert('Image upload failed: '+ message);
              thisprops.refreshState();
              $('#add-room-form .collapsible-header').trigger('click');
              $('#add-room-form input, select, textarea').val(null);
              $('#preloader').hide();
            }
          });
        }
      }.bind(this),
      error: function() {

        alert('Something failed');
        $('#preloader').hide();
      }
    })
  },
  saveRooms: function() {

    // Create new rooms object
    var newRoomsObj = [];

    $('.existing-room').each(function() {

      // Set up new object for each room
      var room = {};

      // Find params
      room.id = $(this).attr('data-id');
      room.name = $(this).find('.room-name').val();
      room.bed = $(this).find('select.bed-type').val();
      room.vacancies = $(this).find('select.vacancies').val();
      room.facilities = $(this).find('select.facilities').val();
      room.shared = $(this).find('input.shared-switch').prop('checked');
      room.img = $(this).find("#photo_room_"+room.id).val();
      room.description = $(this).find('.room-description').val();

      newRoomsObj.push(room);
    })

    // Modify home object, using new rooms object
    if (typeof homeObj !== 'undefined') {
      homeObj.rooms = newRoomsObj;
      this.props.updateHome(function() {
        toast('Rooms updated');
      });
      console.log(newRoomsObj);
    }

  },
  componentDidMount: function() {
    $('a#add-room').click(this.addRoom);
    $('a#save-rooms').click(this.saveRooms);
  },
  componentDidUpdate: function() {

    if (this.props.rooms.length > 0) {

      var rooms = (this.props.rooms).sort(function(a,b){return -(a.id-b.id)});

      var RoomsContainer = React.createClass({
        render: function() {
          var allRooms = []
          var inputstyle = {cursor: 'pointer',position: 'absolute',opacity: 0,top: 0,left: 0,width: '100%',height: '100%'};
          rooms.forEach(function(obj) {
            allRooms.push(
              <RoomModule
                  id={obj.id}
                  key={obj.id}
                  roomName={obj.name}
                  bed={obj.bed}
                  vacancies={obj.vacancies}
                  facilities={obj.facilities}
                  shared={obj.shared}
                  img={obj.img}
                  description={obj.description}
                  price={obj.price}
                  inputstyle={inputstyle}
              />
            )
          })
          return (
            <ul className="collapsible rooms-collapsible existing-rooms" data-collapsible="accordion">
              {allRooms}
            </ul>
          )
        }
      })

    } else {

      var RoomsContainer = React.createClass({
        render: function() {
          return (
            <ul className="collapsible rooms-collapsible" data-collapsible="accordion">
              <li className='white'><div id='name' className="collapsible-header grey-text">{i18n.t('manage_home:rooms_list_placeholder')}</div><div className="edit grey-text text-lighten-1"></div></li>
            </ul>
          )
        }
      })

    }

    ReactDOM.render(
      <RoomsContainer
      />, document.querySelector('#existing-rooms')
    )

    $('ul.existing-rooms').collapsible();

    $('.upload-room-photo').each(function(index, value){
      value.onchange = function(){
        console.log(value.attributes.roomid);
        $('a#save-rooms').addClass("disabled");
        var file = value.files;
        if(file){
          var formData = new FormData();
          var token = JSON.parse(atob(localStorage.getItem('JWT').split('.')[1]));
          for(var f = 0; f < file.length; f++){
            formData.append('photos', file[f]);
          }
          $.ajax({
            url : '/upload/users/'+token.rid+'/homes/'+token.hid+'/rooms/'+value.attributes.roomid.nodeValue+'/photo',
            type : 'POST',
            data : formData,
            cache : false,
            contentType : false,
            processData : false,
            beforeSend: function(xhr){xhr.setRequestHeader('abroadauth', 'Bearer ' + localStorage.getItem('JWT'))},
            success : function(data, textStatus, jqXHR) {
              alert("Image uploaded!");
              var result = JSON.parse(data);
              for(var img in result){
                if(result[img].status == 'OK'){
                  console.log(result[img].location);
                  $('#photo_room_'+value.attributes.roomid.nodeValue).val(result[img].location);
                }
              }
              $('a#save-rooms').removeClass("disabled");
            },
            error: function(jqXHR) {
              var message = jqXHR.responseText;
              alert('Image upload failed: '+ message);
              $('a#save-rooms').removeClass("disabled");
            }
          });
        }
      }
    });

  },
  render: function() {

    return (
        <div></div>
    );
  }
});
