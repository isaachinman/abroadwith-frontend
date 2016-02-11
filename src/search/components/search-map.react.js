var React = require('react');

module.exports = React.createClass({
  componentDidUpdate: function() {

    // Add a marker for each result
    if (this.props) {
      if (this.props.results && typeof markers !== 'undefined') {

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        var pictureLabel = document.createElement("img");
        pictureLabel.src = "https://raw.githubusercontent.com/encharm/Font-Awesome-SVG-PNG/master/black/png/64/arrow-circle-o-left.png";

        this.props.results.forEach(function(obj) {

          markers.push(new google.maps.Marker({
            optimized: false,
            map: bigMap,
            title: obj.roomId.toString(),
            position: new google.maps.LatLng(obj.lat, obj.lng),
            icon: defaultIcon,
            zIndex: 1
          }));

        })

      }
    }

  },
  componentDidMount: function() {

    window.initAutocomplete = function() {

      window.bigMap = new google.maps.Map(document.getElementById('search-map'), {
        center: {
          lat: 20,
          lng: 0
        },
        zoom: 2,
        options: {
          scrollwheel: false,
          mapTypeControl: false,
          streetViewControl: false
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            "featureType": "all",
            "elementType": "all",
            "stylers": [
              {
                "hue": "#909AA8"
              }, {
                "visibility": "simplified"
              }, {
                "lightness": "35"
              }, {
                "gamma": "1.25"
              }
            ]
          }
        ]
      });

      // Create the search box and link it to the UI element.
      var input = document.getElementById('location');
      var searchBox = new google.maps.places.SearchBox(input);

      $('#location').keydown(function(event) {

        if (event.keyCode == 10 || event.keyCode == 13) {
          event.preventDefault();
          google.maps.event.trigger(searchBox, 'place_changed');
        }

      });

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

    window.defaultIcon = {
      url: 'data:image/svg+xml;utf-8, \
<svg width="32" height="32" viewBox="646 -816 1792 1792" xmlns="http://www.w3.org/2000/svg"> \
<path fill="#9FD06D" d="M2054-176c0,72.7-11,132.3-33,179l-364,774c-10.7,22-26.5,39.3-47.5,52s-43.5,19-67.5,19s-46.5-6.3-67.5-19 \
s-36.5-30-46.5-52L1063,3c-22-46.7-33-106.3-33-179c0-141.3,50-262,150-362s220.7-150,362-150s262,50,362,150S2054-317.3,2054-176z" ></path> \
</svg>'
    }
    window.hoverIcon = {
      url: 'data:image/svg+xml;utf-8, \
<svg width="48" height="48" viewBox="646 -816 1792 1792" xmlns="http://www.w3.org/2000/svg"> \
<path fill="#4A91E2" d="M2054-176c0,72.7-11,132.3-33,179l-364,774c-10.7,22-26.5,39.3-47.5,52s-43.5,19-67.5,19s-46.5-6.3-67.5-19 \
s-36.5-30-46.5-52L1063,3c-22-46.7-33-106.3-33-179c0-141.3,50-262,150-362s220.7-150,362-150s262,50,362,150S2054-317.3,2054-176z" ></path> \
</svg>'
    }

    return (
      <div>
        <script src="https://maps.googleapis.com/maps/api/js?signed_in=true&libraries=places,geometry&callback=initAutocomplete&types=(cities)" async defer></script>
      </div>
    );
  }
});
