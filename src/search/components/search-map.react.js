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

          var marker = new MarkerWithLabel({
            optimized: false,
            map: bigMap,
            title: obj.roomId.toString(),
            position: new google.maps.LatLng(obj.lat, obj.lng),
            icon: ' ',
            zIndex: 1,
            labelAnchor: new google.maps.Point(20, 35),
            labelContent:"<div class='price'>€" + obj.price + "</div><div class='down-triangle''></div>",
            labelClass: "map-marker-label",
          });

          markers.push(marker);

          // On marker click, scroll to appropriate search result
          google.maps.event.addListener(marker, "click", function () {
            document.getElementById('result-'+markers.indexOf(marker)).scrollIntoView();
          });

        })
      }
    }

  },
  componentDidMount: function() {

    window.initAutocomplete = function() {

      $('#map-scripts').append("<script src='https://google-maps-utility-library-v3.googlecode.com/svn/tags/markerwithlabel/1.1.9/src/markerwithlabel_packed.js'></script>");

      window.defaultIcon = {
        url: 'data:image/svg+xml;utf-8,' +
        encodeURIComponent($('#default-icon').html())
      }
      window.hoverIcon = {
        url: 'data:image/svg+xml;utf-8,' +
        encodeURIComponent($('#hover-icon').html())
      }

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
                "lightness": "20"
              }, {
                "gamma": "1.5"
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
          bigMap.setZoom(9)
          handleChange();
        });

      });
    }

  },
  render: function() {

    return (
      <div id='map-scripts'>
        <script src="https://maps.googleapis.com/maps/api/js?signed_in=true&libraries=places,geometry&callback=initAutocomplete&types=(cities)" async defer></script>
      </div>
    );
  }
});
