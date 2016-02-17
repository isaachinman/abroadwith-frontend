var React = require('react');
var RoomModule = require('./room-module.react')

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
    var rooms = [];
    if (this.props.rooms) {

      this.props.rooms.forEach(function(obj) {
        React.render(
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
            />, document.querySelector('#existing-rooms-placeholder')
        )
      })

    } else {
      rooms = <li className='white'><div id='name' className="collapsible-header">Your rooms will appear here</div><div className="edit grey-text text-lighten-1"></div></li>
    }

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
