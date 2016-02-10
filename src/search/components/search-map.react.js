var React = require('react');

module.exports = React.createClass({
  componentDidUpdate: function() {

    // Add a marker for each result
    if (this.props) {
      if (this.props.results) {

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        this.props.results.forEach(function(obj) {

          var duplicate = false;
          for (var i = 0; i < markers.length; i++) {
            if (google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(obj.lat, obj.lng), markers[i].getPosition()) < 1.0) {
              duplicate = true;
            }
          }
          if (!duplicate) {
            markers.push(new google.maps.Marker({
              map: bigMap,
              title: obj.roomId.toString(),
              position: new google.maps.LatLng(obj.lat, obj.lng)
            }));
          }

        })
      }
    }

  },
  componentDidMount: function() {

    window.initAutocomplete = function() {

      window.bigMap = new google.maps.Map(document.getElementById('search-map'), {
        center: {
          lat: 0,
          lng: 0
        },
        zoom: 1,
        options: {
          scrollwheel: false,
          mapTypeControl: false,
          streetViewControl: false
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      // Create the search box and link it to the UI element.
      var input = document.getElementById('location');
      var searchBox = new google.maps.places.SearchBox(input);

      // Bias the SearchBox results towards current map's viewport.
      bigMap.addListener('bounds_changed', function() {
        searchBox.setBounds(bigMap.getBounds());
      });

      bigMap.addListener('zoom_changed', handleChange);
      bigMap.addListener('dragend', handleChange);

      window.markers = [];

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
          bigMap.setCenter(place.geometry.location);
          handleChange();
        });

      });
    }

  },
  render: function() {

    return (
      <div>
        <script src="https://maps.googleapis.com/maps/api/js?signed_in=true&libraries=places,geometry&callback=initAutocomplete&types=(cities)" async defer></script>
      </div>
    );
  }
});
