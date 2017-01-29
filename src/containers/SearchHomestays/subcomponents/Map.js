// Absolute imports
import React, { Component, PropTypes } from 'react'
import GoogleMap from 'google-map-react'
import MapStyles from 'data/constants/MapStyles'
import shortid from 'shortid'

// Relative imports
import styles from '../SearchHomestays.styles'
import Marker from './MapMarker'
import SearchBox from './Searchbox'

export default class Map extends Component {

  render() {

    const { center, currency, handleSearchboxChange, handleLocationChange, results, zoom } = this.props

    return (
      <div style={styles.mapContainer}>
        <SearchBox handleSearchboxChange={handleSearchboxChange} />
        <GoogleMap
          center={center}
          zoom={zoom}
          onChange={handleLocationChange}
          options={() => ({
            panControl: false,
            mapTypeControl: false,
            scrollwheel: false,
            styles: MapStyles,
          })}
        >
          {results.map(result => <Marker key={shortid()} currency={currency} lat={result.lat} lng={result.lng} {...result} />)}
        </GoogleMap>
      </div>
    )
  }
}

Map.propTypes = {
  center: PropTypes.object,
  currency: PropTypes.string,
  handleSearchboxChange: PropTypes.func,
  handleLocationChange: PropTypes.func,
  results: PropTypes.array,
  zoom: PropTypes.number,
}
