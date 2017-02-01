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
import { performRoomSearch, defineHomestayMapSize } from 'redux/modules/ui/search/homestaySearch'
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
    search: state.uiPersist.homestaySearch,
    uiLanguage: state.ui.locale.value,
    routing: state.routing.locationBeforeTransitions,
  })
)
@translate()
@Radium
export default class SearchHomestays extends Component {

  state = {
    initialSearchPerformed: false,
  }

  componentWillReceiveProps = nextProps => {

    const { dispatch, routing, search } = this.props

    // This is our initialisation step
    if (!search.mapDimensions.width && nextProps.search.mapDimensions.width) {

      // We will assume that if there aren't bounds in the store, and no data has been loaded,
      // the user isn't already inside a search process
      if (!search.loaded && !search.params.mapData.bounds) {

        // If there are bounds in the query, hydrate the entire query
        if (routing.query.maxLat && routing.query.maxLng && routing.query.minLat && routing.query.minLng) {

          console.log('search being called from mount function')
          dispatch(performRoomSearch(homestaySearchUrlToParams(this.props.routing.query)))

        } else {

          // If there are no bounds in the query, hydrate any remaining query params,
          // and append some default location variables
          dispatch(performRoomSearch(Object.assign({}, homestaySearchUrlToParams(this.props.routing.query), {
            mapData: {
              bounds: {
                maxLat: -15.5,
                maxLng: -19.1,
                minLat: 79.8,
                minLng: 63.1,
              },
            },
          })))

        }

      }

    }

  }

  handleMapChange = newGeometry => {

    const { dispatch, search } = this.props

    console.log(newGeometry)

    if (this.state.initialSearchPerformed && !search.loading) {
      console.log('search being called from map function')
      dispatch(performRoomSearch(Object.assign({}, search.params, {
        mapData: {
          bounds: gmapBoundsToAbroadwithBounds(newGeometry.bounds),
        },
      })))
    } else if (!this.state.initialSearchPerformed) {
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

    const currency = search.data && search.data.params ? search.data.params.currency : uiCurrency

    // Default settings
    let center = false
    let zoom = false

    // The map must be measured before it can be rendered
    if (search.mapDimensions.width && search.mapDimensions.height && search.params.mapData.bounds && search.params.mapData.bounds.maxLat) {
      const fittedBounds = fitBounds(
        abroadwithBoundsToGMAPBounds(search.params.mapData.bounds),
        { width: search.mapDimensions.width || 0, height: search.mapDimensions.height || 0 }
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
            onMeasure={dimensions => {
              this.props.dispatch(defineHomestayMapSize(dimensions))
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
