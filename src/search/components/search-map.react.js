var React = require('react');

module.exports = React.createClass({
  onComponentUpdate: function() {},
  componentDidMount: function() {

    window.initAutocomplete = function() {

      window.bigMap = new google.maps.Map(document.getElementById('search-map'), {
        center: {
          lat: -33.8688,
          lng: 151.2195
        },
        zoom: 13,
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

      var markers = [];

      // Add a marker for each result
      if (this.props.results) {

        this.props.results.forEach(function(obj) {
          var result = <IndividualResult
                key={obj.roomId}
                lat={obj.lat}
                lng={obj.lng}
            />;
          results.push(result);
        })

      }

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

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        bigMap.fitBounds(bounds);
      });
    }

  },
  render: function() {

    return (
      <div>
        <script src="https://maps.googleapis.com/maps/api/js?signed_in=true&libraries=places&callback=initAutocomplete&types=(cities)" async defer></script>
      </div>
    );
  }
});
