// Absolute imports
import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import abroadwithBoundsToGMAPBounds from 'utils/search/abroadwithBoundsToGMAPBounds'
import gmapBoundsToAbroadwithBounds from 'utils/search/gmapBoundsToAbroadwithBounds'
import { connect } from 'react-redux'
import { InlineSearchUnit } from 'components'
import { Grid } from 'react-bootstrap'
import homestaySearchUrlToParams from 'utils/search/homestaySearchUrlToParams'
import Measure from 'react-measure'
import { translate } from 'react-i18next'
import { fitBounds } from 'google-map-react/utils'
import { roomPopoverClose, roomResultMouseLeave } from 'redux/modules/ui/search/hoverables'
import { updateRoomSearchParams, performRoomSearch } from 'redux/modules/ui/search/homestaySearch'
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
    routing: state.routing.locationBeforeTransitions,
  })
)
@translate()
@Radium
export default class SearchHomestays extends Component {

  state = {
    initialSearchPerformed: false,
    mapSize: {},
  }

  componentDidMount = () => {

    const { dispatch, search } = this.props

    console.log('MOUNTING: ', search.loaded)

    // If this component mounts without bounds,
    // the map will automatically place itself based on query params
    if (!search.params.mapData.bounds && this.props.routing.query.maxLat) {

      if (search.data.loaded) {
        dispatch(updateRoomSearchParams(homestaySearchUrlToParams(this.props.routing.query)))
      } else {
        console.log('search being called from mount function')
        dispatch(performRoomSearch(homestaySearchUrlToParams(this.props.routing.query)))
      }

    }

  }

  handleMapChange = newGeometry => {

    const { dispatch, search } = this.props

    console.log('newGEO: ', newGeometry)

    if (this.state.initialSearchPerformed && this.state.mapSize.width && this.state.mapSize.height) {

      console.log('trying to fit: ', fitBounds(newGeometry.bounds, { width: this.state.mapSize.width || 0, height: this.state.mapSize.height || 0 }))

      dispatch(performRoomSearch(Object.assign({}, search.params, {
        mapData: {
          bounds: gmapBoundsToAbroadwithBounds(fitBounds(
            newGeometry.bounds,
            { width: this.state.mapSize.width || 0, height: this.state.mapSize.height || 0 }
          ).newBounds),
        },
      })))
    } else {
      this.setState({ initialSearchPerformed: true })
    }

  }

  handleMapClick = ({ event }) => {

    // Somewhat hacky way of ensuring the click target is the parent map
    if (event.target.style.width === '100%') {
      const { dispatch } = this.props
      dispatch(roomPopoverClose())
      dispatch(roomResultMouseLeave())
    }

  }

  render() {

    const { uiCurrency, t, search } = this.props
    const { mapSize } = this.state

    const currency = search.data && search.data.params ? search.data.params.currency : uiCurrency

    // Default settings
    let center = false
    let zoom = false

    // The map must be measured before it can be rendered
    if (mapSize.width && mapSize.height && search.params.mapData.bounds && search.params.mapData.bounds.maxLat) {
      const fittedBounds = fitBounds(
        abroadwithBoundsToGMAPBounds(search.params.mapData.bounds),
        { width: mapSize.width || 0, height: mapSize.height || 0 }
      )
      center = fittedBounds.center
      zoom = fittedBounds.zoom
    }

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
          <Measure
            onMeasure={(dimensions) => {
              this.setState({ mapSize: dimensions })
            }}
          >
            <div style={styles.mapPanel}>
              {center && zoom &&
                <Map
                  center={center}
                  currency={currency}
                  handleLocationChange={this.handleMapChange}
                  handleMapClick={this.handleMapClick}
                  zoom={zoom}
                  results={search.data.results}
                />
              }
            </div>
          </Measure>
        </Grid>
      </div>
    )
  }
}

SearchHomestays.propTypes = {
  dispatch: PropTypes.func,
  search: PropTypes.object,
  routing: PropTypes.object,
  t: PropTypes.func,
  uiCurrency: PropTypes.string,
  uiLanguage: PropTypes.string,
}
