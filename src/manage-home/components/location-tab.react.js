var React = require('react');

module.exports = React.createClass({
  componentDidMount: function() {
  },
  handleClick: function() {

    // Modify home object, using new location object
    if (typeof homeObj !== 'undefined') {
      homeObj.location = newLocationObj;
    }

    // POST new home object, refresh state upon success
    console.log(homeObj);


  },
  render: function() {

    window.mapLat;
    window.mapLng;
    window.mapZoom;

    if (this.props.location) {

      var fullAddress = this.props.location.street + ', ' + this.props.location.complement + ', ' + this.props.location.city + ' ' + this.props.location.zipCode + ', ' + this.props.location.country;
      mapLat = this.props.location.lat;
      mapLng = this.props.location.lng;
      mapZoom = 16;
      console.log(mapLat + ' ' + mapLng)

      $('#home-address').val(fullAddress);

    } else {
      mapLat = 60;
      mapLng = 180;
      mapZoom = 2;
    }

    window.initAutocomplete = function() {
      var map = new google.maps.Map(document.getElementById('home-map'), {
        center: {
          lat: mapLat+.0025,
          lng: mapLng-.0125
        },
        zoom: mapZoom,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false
      });

      var markers = [];

      if (mapLat !== 60 && mapLng !== 180) {
        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          position: {
            lat: mapLat,
            lng: mapLng
          }
        }));
      }

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

          window.newCoordinates = place.geometry.location;

          var googleResponse = place.address_components;

          var googleResponseParsed={};
          $.each(googleResponse, function(k,v1) {jQuery.each(v1.types, function(k2, v2){googleResponseParsed[v2]=v1.long_name});})

          window.newLocationObj = {
            "street":googleResponseParsed.street_number+' '+googleResponseParsed.route,
            "zipCode":googleResponseParsed.postal_code,
            "city":googleResponseParsed.locality,
            "country":googleResponseParsed.country,
            "neighbourhood":googleResponseParsed.sublocality_level_2,
            "lat":place.geometry.location.lat(),
            "lng":place.geometry.location.lng()
          }

        });
        map.fitBounds(bounds);
      });
    }
    $('#location-tab').click(initHiddenMap)
    function initHiddenMap(e) {
      document.getElementById('location-tab').removeEventListener('click', initHiddenMap)
      initAutocomplete();
    }

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=initAutocomplete';
    $("#location").append(script);


    return (

      <div id="location" className="col s12 m10 offset-m1 l10 offset-l1 relative">

        <div className='manage-home-block'>

          <div className='row'>
            <h4>What's your address?</h4>
          </div>

          <div className='row relative no-margin'>
            <input id="home-address" className="controls" type="text" placeholder="What's your address?"/>
            <a className='btn update-home-address'>Save address</a>

            <div className='row your-address-row'>
              <div id="home-map" className='medium-map'></div>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col s6 offset-s3'>
            <a id='location-save' className='btn btn-primary save-btn' onClick={this.handleClick}>Save</a>
          </div>
          <div className='col s3 right-align'>
            <a id='next-btn'><i className="fa fa-chevron-right grey-text text-lighten-1 next-btn"></i></a>
          </div>
        </div>

      </div>


    );
  }
});
