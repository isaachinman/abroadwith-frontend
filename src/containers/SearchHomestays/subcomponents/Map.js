// Absolute imports
import React, { Component, PropTypes } from 'react'
import GoogleMap from 'google-map-react'
import MapStyles from 'data/constants/MapStyles'
import shortid from 'shortid'

// Relative imports
import styles from '../SearchHomestays.styles'
import Marker from './MapMarker'

export default class Map extends Component {

  render() {

    const { center, currency, handleLocationChange, handleMapClick, results, zoom } = this.props

    return (
      <div style={styles.mapContainer}>
        <GoogleMap
          center={center}
          zoom={zoom}
          onChange={handleLocationChange}
          onClick={handleMapClick}
          options={() => ({
            panControl: false,
            mapTypeControl: false,
            scrollwheel: false,
            styles: MapStyles,
          })}
        >
          {results && results.map(result => <Marker key={shortid()} currency={currency} lat={result.lat} lng={result.lng} {...result} />)}
        </GoogleMap>
      </div>
    )
  }
}

Map.propTypes = {
  center: PropTypes.object,
  currency: PropTypes.string,
  handleLocationChange: PropTypes.func,
  handleMapClick: PropTypes.func,
  results: PropTypes.array,
  zoom: PropTypes.number,
}
