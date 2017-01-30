// Absolute imports
import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { InlineSearchUnit } from 'components'
import { Grid } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { fitBounds } from 'google-map-react/utils'
import { roomPopoverClose, roomResultMouseLeave } from 'redux/modules/ui/search/hoverables'
import { performRoomSearch } from 'redux/modules/ui/search/homestaySearch'
import Radium from 'radium'
import SpinLoader from 'components/SpinLoader/SpinLoader'

// Relative imports
import Map from './subcomponents/Map'
import ResultList from './subcomponents/ResultList'
// import SearchBox from './subcomponents/Searchbox'
import styles from './SearchHomestays.styles'

@connect(
  state => ({
    uiCurrency: state.ui.currency.value,
    reviews: state.privateData.reviews,
    search: state.ui.homestaySearch,
    uiLanguage: state.ui.locale.value,
  })
)
@translate()
@Radium
export default class SearchHomestays extends Component {

  state = {
    map: {
      center: { lat: 52.52, lng: 13.405 },
      zoom: 9,
    },
  }

  performSearch = () => {
    const { bounds } = this.state.map
    const url = `/homestays/search/get-results?minPrice=0&maxPrice=500&pageSize=10&pageOffset=0&maxLat=${bounds.se.lat}&maxLng=${bounds.nw.lng}&minLat=${bounds.nw.lat}&minLng=${bounds.se.lng}`
    this.props.dispatch(performRoomSearch(url))
  }

  handleLocationChange = newGeometry => {
    this.setState({
      map: Object.assign({}, this.state.map, {
        bounds: {
          nw: newGeometry.bounds.nw,
          se: newGeometry.bounds.se,
        },
      }),
      mapSize: {
        width: newGeometry.size.width,
        height: newGeometry.size.height,
      },
    }, this.performSearch)
  }

  handleMapClick = ({ event }) => {

    console.log(event.target)

    // Somewhat hacky way of ensuring the click target is the parent map
    if (event.target.style.width === '100%') {
      const { dispatch } = this.props
      dispatch(roomPopoverClose())
      dispatch(roomResultMouseLeave())
    }

  }

  handleSearchboxChange = place => {
    console.log('place: ', place)
    const { mapSize } = this.state
    const { viewport, location } = place.geometry

    // Larger places come with a viewport object from Google
    if (viewport) {
      const bounds = { nw: { lat: viewport.f.b, lng: viewport.b.b }, se: { lat: viewport.f.f, lng: viewport.b.f } }
      const { center, zoom } = fitBounds(
        bounds,
        { width: mapSize.width, height: mapSize.height }
      )
      this.setState({ map: { center, zoom, bounds } })
    } else {

      // Smaller places, like specific addresses, do not
      this.setState({
        map: {
          center: {
            lat: location.lat(),
            lng: location.lng(),
          },
          zoom: 15,
        },
      })

    }

  }

  render() {

    const { uiCurrency, t, search } = this.props
    const { map } = this.state

    const currency = search.data && search.data.params ? search.data.params.currency : uiCurrency
    console.log(this)

    return (
      <div>
        <Helmet title={t('search.title')} />
        <Grid style={styles.grid}>
          <div style={styles.controls}>
            <div style={styles.headerBg}>
              <div style={styles.header}>
                <h5>Find a place to stay.</h5>
              </div>
            </div>
            <div style={styles.filters}>
              <InlineSearchUnit integrated />
            </div>
          </div>
          <div style={styles.resultScrollList}>
            <SpinLoader light noLoader show={search.loading}>
              <div>
                <ResultList
                  currency={currency}
                  results={search.data.results}
                />
              </div>
            </SpinLoader>
          </div>
          <div style={styles.mapPanel}>
            <Map
              center={map.center}
              currency={currency}
              handleLocationChange={this.handleLocationChange}
              handleMapClick={this.handleMapClick}
              zoom={map.zoom}
              results={search.data.results}
            />
          </div>
        </Grid>
      </div>
    )
  }
}

SearchHomestays.propTypes = {
  dispatch: PropTypes.func,
  search: PropTypes.object,
  t: PropTypes.func,
  uiCurrency: PropTypes.string,
  uiLanguage: PropTypes.string,
}
