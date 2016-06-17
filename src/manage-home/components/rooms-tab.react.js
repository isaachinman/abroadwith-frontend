const React = require('react');
const ReactDOM = require('react-dom');
const RoomModule = require('./room-module.react');
const i18n = require('i18n');

const Dropzone = require('dropzone')
Dropzone.autoDiscover = false

const domains = require('domains');
const JWT = require('JWT');
const POST = require('POST');

const toast = require('toast');

module.exports = React.createClass({
  addRoomToList: function(newRoom) {

    document.getElementById('home-add-room-form').reset()
    $('#add-room-form select.material').material_select()

    var refreshState = this.props.refreshState

    var newRooms = this.props.props.rooms
    newRooms.push(newRoom)

    this.setState({rooms:newRooms})

    var RoomsContainer = React.createClass({
      render: function() {
        var allRooms = []
        var inputstyle = {cursor: 'pointer',position: 'absolute',opacity: 0,top: 0,left: 0,width: '100%',height: '100%'}
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
              canDelete={true}
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

    var url = domains.API+'/users/'+JWT.rid+'/homes/'+JWT.hid+'/rooms'
    var success = function(response) {

      $('#add-room-form .collapsible-header').trigger('click')
      newRoom.id = response.roomId

      if (newRoomPhoto.files.length > 0) {

        // There's a room photo to upload
        newRoomPhoto.options.url = '/upload/users/'+JWT.rid+'/homes/'+JWT.hid+'/rooms/'+response.roomId+'/photo'

        newRoomPhoto._callbacks.success[0] = function(file, serverResponse) {

          var response = JSON.parse(serverResponse)

          $.each(response, function(index, obj) {
            if (obj.status == 'OK') {
              newRoom.img = obj.location;
            }
          })

          addRoomToList(newRoom)
          $('#add-room-form .collapsible-header').hasClass('active') ? $('#add-room-form .collapsible-header').trigger('click') : null
          $('#preloader').hide()
        }

        newRoomPhoto.processQueue()

      } else {

        // There's no room image
        addRoomToList(newRoom);
        $('#preloader').hide();

      }

    };
    POST(url, newRoom, success);

  },
  saveRooms: function() {

    // Create new rooms object
    var newHomeObj = this.props.props
    var newRoomsObj = []

    if (this.state.rooms !== undefined && this.state.rooms !== null) {

      newRoomsObj = this.state.rooms

    } else {

      $('.existing-room').each(function() {

       // Set up new object for each room
       var id = parseInt($(this).attr('data-id'))
       var room = {
         id: id,
         name: $(this).find('.room-name').val(),
         bed: $(this).find('select.bed-type').val(),
         vacancies: parseInt($(this).find('select.vacancies').val()),
         facilities: $(this).find('select.facilities').val(),
         shared: $(this).find('input.shared-switch').prop('checked'),
         img: $(this).find("#photo_room_"+id).val() !== '' ? $(this).find("#photo_room_"+id).val() : null,
         description: $(this).find('.room-description').val(),
         price: $(this).attr('data-price')
       }

       newRoomsObj.push(room)

     })

    }

    // Modify home object, using new rooms object
    newHomeObj.rooms = newRoomsObj
    this.props.updateHome(newHomeObj, function() {
      this.setState({rooms:null})
      toast(i18n.t('manage_home:room_updated_toast'))
    }.bind(this))


  },
  componentDidMount: function() {

    $('form#home-add-room-form').submit(function(e) {
      e.preventDefault()
      this.addRoom()
    }.bind(this))

    $('a#save-rooms').click(this.saveRooms);

    window.newRoomPhoto = new Dropzone('#new-room-photo', {
      url: '/',
      maxFiles: 1,
      autoProcessQueue: false,
      method: 'post',
      dictDefaultMessage: i18n.t('manage_home:drop_room_photo'),
      headers: {'abroadauth': 'Bearer ' + localStorage.getItem('JWT')},
      maxFilesize: 10,
      acceptedFiles: 'image/jpeg,image/png',
      init: function() {
      this.on("maxfilesexceeded", function(file) {
          this.removeAllFiles()
          this.addFile(file)
          toast(i18n.t('manage_home:one_picture_per_room'))
        })
      }
    })

  },
  componentDidUpdate: function() {

    $('ul.existing-rooms').collapsible()

  },
  render: function() {

    var refreshState = this.props.refreshState;

    if (this.props.props.rooms && this.props.props.rooms.length > 0) {

      var rooms = (this.props.props.rooms).sort(function(a,b){return -(a.id-b.id)})
      var saveRooms = this.saveRooms

      var canDelete = this.props.props.rooms.length <= 1 ? false : true

      var RoomsContainer = React.createClass({
        render: function() {
          var allRooms = []
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
                refreshState={refreshState}
                canDelete={canDelete}
                rooms={rooms}
                saveRooms={saveRooms}
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
