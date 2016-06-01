var React = require('react')

var GoogleMapsLoader = require('google-maps')
GoogleMapsLoader.KEY = 'AIzaSyBQW0Z5fmFm8snLhXDOVuD8YuegwCMigqQ'
GoogleMapsLoader.LIBRARIES = ['places','geometry']

var currencies = require('currencies')

module.exports = React.createClass({
  componentDidUpdate: function() {

    var MarkerWithLabel = require('markerwithlabel')

    // Add a marker for each result
    if (this.props) {
      if (this.props.results && typeof markers !== 'undefined') {

        var currency = this.props.currency

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null)
        })
        markers = []

        this.props.results.forEach(function(obj) {

          var marker = new MarkerWithLabel({
            optimized: false,
            map: bigMap,
            title: obj.roomId.toString(),
            position: new google.maps.LatLng(obj.lat, obj.lng),
            icon: ' ',
            zIndex: 1,
            labelAnchor: new google.maps.Point(20, 35),
            labelContent: "<div class='price'>" + currencies[currency] + Math.ceil(obj.price) + "</div><div class='down-triangle''></div>",
            labelClass: "map-marker-label"
          })

          markers.push(marker)

          // On marker click, scroll to appropriate search result
          google.maps.event.addListener(marker, "click", function() {
            document.getElementById('result-' + markers.indexOf(marker)).scrollIntoView()
          })

        })
      }
    }
  },
  componentDidMount: function() {

    GoogleMapsLoader.load(function(google) {

      window.defaultIcon = {
        url: 'data:image/svg+xml;utf-8,' + encodeURIComponent($('#default-icon').html())
      }
      window.hoverIcon = {
        url: 'data:image/svg+xml;utf-8,' + encodeURIComponent($('#hover-icon').html())
      }

      window.bigMap = new google.maps.Map(document.getElementById('search-map'), {
        center: {
          lat: 20,
          lng: 0
        },
        noClear: true,
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
      })

      // Create a PlacesService to run prefilled text queries
      var service = new google.maps.places.PlacesService(bigMap)

      // Create the search box and link it to the UI element.
      var input = document.getElementById('location')
      var searchBox = new google.maps.places.SearchBox(input)

      $('#location').keydown(function(event) {

        if (event.keyCode == 10 || event.keyCode == 13) {
          event.preventDefault()
          google.maps.event.trigger(searchBox, 'place_changed')
        }

      });

      bigMap.addListener('bounds_changed', function() {
        searchBox.setBounds(bigMap.getBounds())
      });

      window.markers = []

      searchBox.addListener('places_changed', function() {

        var places = searchBox.getPlaces()

        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null)
        })
        markers = []

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds()
        places.forEach(function(place) {
          bigMap.setCenter(place.geometry.location)
          bigMap.fitBounds(place.geometry.viewport)
          handleChange()
        });

      });

      // There is a prefilled string location query
      if ($('#search-map').attr('data-location') !== '') {

        // Set input value to prefilled string
        $('input#location').val(($('#search-map').attr('data-location').replace(/_/g, " ")))

        // Compile a request
        request = {
          query: $('#search-map').attr('data-location').replace(/_/g, " ")
        };

        // Send request and trigger place change with response
        service.textSearch(request, function(places) {
          bigMap.setCenter(places[0].geometry.location)
          searchBox.set('places', places || [])
        });

      } else {

        var predeterminedQuery = window.location.search

        // This is the main initial GET for search page
        // Have to wait for map to init before we can call getBounds
        google.maps.event.addListenerOnce(bigMap, 'idle', function(){
          predeterminedQuery !== '' ? handleChange(predeterminedQuery) : handleChange()
        })

        bigMap.addListener('zoom_changed', handleChange)
        bigMap.addListener('dragend', handleChange)

      }

    })

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
