var React = require('react');
var ReactDOM = require('react-dom');
var RoomModule = require('./room-module.react');
var i18n = require('../../global/util/i18n');

var domains = require('domains');
var JWT = require('JWT');
var POST = require('POST');

var toast = require('toast');

module.exports = React.createClass({
  addRoomToList: function(newRoom) {

    var refreshState = this.props.refreshState;

    var newRooms = this.props.props.rooms;
    newRooms.push(newRoom)

    this.setState({rooms:newRooms});

    var RoomsContainer = React.createClass({
      render: function() {
        var allRooms = []
        var inputstyle = {cursor: 'pointer',position: 'absolute',opacity: 0,top: 0,left: 0,width: '100%',height: '100%'};
        newRooms.forEach(function(obj) {
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
              refreshState={refreshState}
            />
          )
        })
        return (
          <ul className="collapsible rooms-collapsible existing-rooms" data-collapsible="accordion">
            {allRooms}
          </ul>
        )
      }.bind(this)
    })

    ReactDOM.render(
      <RoomsContainer
      />, document.querySelector('#existing-rooms')
    )

    $('ul.existing-rooms').collapsible();
    $('#room-name').val('');
    $('#room-description').val('');

  },
  addRoom: function() {

    var addRoomToList = this.addRoomToList;

    var newRoom = {
      name: $('#room-name').val(),
      description: $('#room-description').val(),
      vacancies: parseInt($('#room-vacancies').val()),
      shared: $('#room-shared').prop('checked'),
      bed: $('#room-bed').val(),
      facilities: $('#room-facilities').val()
    };

    $('#preloader').show();

    var url = domains.API+'/users/'+JWT.rid+'/homes/'+JWT.hid+'/rooms';
    var success = function(response) {

      newRoom.id = response.roomId;

      $('#add-room-form .collapsible-header').trigger('click');

      var thisprops = this.props;
      var file = $('#new_room_photo')[0].files;
      if(file.length > 0){
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
            addRoomToList(newRoom);
            $('#add-room-form .collapsible-header').hasClass('active') ? $('#add-room-form .collapsible-header').trigger('click') : null;
            $('#add-room-form input, select, textarea').val(null);
            $('#preloader').hide();
          },
          error: function(jqXHR) {
            var message = jqXHR.responseText;
            alert('Image upload failed: '+ message);
            addRoomToList(newRoom);
            $('#add-room-form .collapsible-header').trigger('click');
            $('#add-room-form input, select, textarea').val(null);
            $('#preloader').hide();
          }
        });
      } else {
        addRoomToList(newRoom);
        $('#preloader').hide();
      }

    };
    POST(url, newRoom, success);

  },
  saveRooms: function() {

    // Create new rooms object
    var newHomeObj = this.props.props;
    var oldRooms = this.props.props.rooms;
    var newRoomsObj = oldRooms.concat(this.state.rooms);

    // Modify home object with new room array
    newHomeObj.rooms = newRoomsObj;

    // Send it off
    this.props.updateHome(newHomeObj, function() {
      toast(i18n.t('manage_home:room_updated_toast'));
    });


  },
  componentDidMount: function() {
    $('a#add-room').click(this.addRoom);
    $('a#save-rooms').click(this.saveRooms);
  },
  componentDidUpdate: function() {

    var refreshState = this.props.refreshState;

    $('ul.existing-rooms').collapsible();

    $('.upload-room-photo').each(function(index, value){
      value.onchange = function(){
        $('a#save-rooms').addClass("disabled");
        var file = value.files;
        if(file){
          var formData = new FormData();
          var token = JSON.parse(atob(localStorage.getItem('JWT').split('.')[1]));
          for(var f = 0; f < file.length; f++){
            formData.append('photos', file[f]);
          }

          $('#preloader').show();

          $.ajax({
            url : '/upload/users/'+token.rid+'/homes/'+token.hid+'/rooms/'+value.attributes.roomid.nodeValue+'/photo',
            type : 'POST',
            data : formData,
            cache : false,
            contentType : false,
            processData : false,
            beforeSend: function(xhr){xhr.setRequestHeader('abroadauth', 'Bearer ' + localStorage.getItem('JWT'))},
            success : function(data, textStatus, jqXHR) {
              toast("Image uploaded");
              var result = JSON.parse(data);
              for(var img in result){
                if(result[img].status == 'OK'){
                  $('#photo_room_'+value.attributes.roomid.nodeValue).val(result[img].location);
                }
              }
              $('a#save-rooms').removeClass("disabled");
              $('#preloader').hide();
            },
            error: function(jqXHR) {
              $('#preloader').hide();
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

    var refreshState = this.props.refreshState;

    if (this.props.props.rooms && this.props.props.rooms.length > 0) {

      var rooms = (this.props.props.rooms).sort(function(a,b){return -(a.id-b.id)});

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
                refreshState={refreshState}
              />
            )
          })
          return (
            <ul className="collapsible rooms-collapsible existing-rooms" data-collapsible="accordion">
              {allRooms}
            </ul>
          )
        }.bind(this)
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

    return (
        <div></div>
    );
  }
});
