var React = require('react');
var ReactDOM = require('react-dom');
var RoomModule = require('./room-module.react')
var i18n = require('../../global/components/i18n');

i18n.loadNamespaces('manage_home');

module.exports = React.createClass({
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
      room.img = $(this).find('.file-path').val();
      room.description = $(this).find('.room-description').val();

      newRoomsObj.push(room);
    })

    // Modify home object, using new rooms object
    if (typeof homeObj !== 'undefined') {
      homeObj.rooms = newRoomsObj;
      console.log(newRoomsObj);
    }

    // POST new home object
    Materialize.toast('Rooms updated', 4000);

  },
  componentDidUpdate: function() {

    if (this.props.rooms) {

      var rooms = this.props.rooms;

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
              />
            )
          })
          return (
            <ul className="collapsible rooms-collapsible" data-collapsible="accordion">
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
              <li className='white'><div id='name' className="collapsible-header">+i18n.t('manage_home:rooms_list_placeholder')+</div><div className="edit grey-text text-lighten-1"></div></li>
            </ul>
          )
        }
      })

    }

    ReactDOM.render(
      <RoomsContainer
      />, document.querySelector('#existing-rooms')
    )

    // Select
    if ($('select.material').length) {
      $('select.material').material_select();
    }

    $('a#save-rooms').click(this.saveRooms);

  },
  render: function() {

    return (
        <div></div>
    );
  }
});
