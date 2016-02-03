var React = require('react');

module.exports = React.createClass({
  componentDidMount: function() {

    window.initAutocomplete = function() {
      var map = new google.maps.Map(document.getElementById('home-map'), {
        center: {
          lat: 60,
          lng: 180
        },
        zoom: 2,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false
      });

      // Create the search box and link it to the UI element.
      var input = document.getElementById('home-address');
      var searchBox = new google.maps.places.SearchBox(input);

      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

      google.maps.event.addListenerOnce(map, 'idle', function() {
         google.maps.event.trigger(map, 'resize');
      });

      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    }
    document.getElementById('location-tab').addEventListener('click', initHiddenMap)
    function initHiddenMap(e) {
      document.getElementById('location-tab').removeEventListener('click', initHiddenMap)
      initAutocomplete();
    }

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=initAutocomplete';
    $("#location").append(script);

  },
  render: function() {

    if (this.props.location) {
      var street = this.props.location.street;
      var complement = this.props.location.complement;
      var zipCode = this.props.location.zipCode;
      var state = this.props.location.state;
      var city = this.props.location.city;
      var country = this.props.location.country;
      var lat = this.props.location.lat;
      var lng = this.props.location.lng;
    }

    return (

      <div id="location" className="col s12 m10 offset-m1 l10 offset-l1 relative">

        <div className='row'>
          <h4>What's your address?</h4>
        </div>

        <div className='row relative no-margin'>
          <input id="home-address" className="controls" type="text" placeholder="What's your address?" />

          <a className='btn update-home-address' onclick="Materialize.toast('Home address updated', 4000)">Save address</a>

          <div className='row your-address-row'>
            <div id="home-map" className='medium-map'></div>
          </div>
        </div>

      </div>


    );
  }
});
