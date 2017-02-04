// Absolute imports
import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import abroadwithBoundsToGMAPBounds from 'utils/search/abroadwithBoundsToGMAPBounds'
import gmapBoundsToAbroadwithBounds from 'utils/search/gmapBoundsToAbroadwithBounds'
import { connect } from 'react-redux'
import { InlineSearchUnit } from 'components'
import { Grid, OverlayTrigger } from 'react-bootstrap'
import homestaySearchUrlToParams from 'utils/search/homestaySearchUrlToParams'
import Measure from 'react-measure'
import { translate } from 'react-i18next'
import { fitBounds } from 'google-map-react/utils'
import { roomPopoverClose, roomResultMouseLeave } from 'redux/modules/ui/search/hoverables'
import { eraseHomestaySearchHistory, performRoomSearch } from 'redux/modules/ui/search/homestaySearch'
import { push } from 'react-router-redux'
import Radium from 'radium'
import SpinLoader from 'components/SpinLoader/SpinLoader'

// Relative imports
import FiltersPanel from './subcomponents/FiltersPanel'
import Map from './subcomponents/Map'
import PriceSlider from './subcomponents/PriceSlider'
import ResultList from './subcomponents/ResultList'
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
    filtersPanelOpen: false,
    initialSearchPerformed: false,
    mapDimensions: {},
  }

  componentWillUpdate = (nextProps, nextState) => {

    const { dispatch, routing, search } = this.props

    // This is our initialisation step
    if (!this.state.mapDimensions.width && nextState.mapDimensions.width) {

      // We will assume that if there aren't bounds in the store, and no data has been loaded,
      // the user isn't already inside a search process
      if (!search.loaded && !search.params.mapData.bounds) {

        // If there are bounds in the query, hydrate the entire query
        if (routing.query.maxLat && routing.query.maxLng && routing.query.minLat && routing.query.minLng) {

          dispatch(performRoomSearch(homestaySearchUrlToParams(this.props.routing.query)))

        } else {

          // If there are no bounds in the query, hydrate any remaining query params,
          // and append some default location variables
          dispatch(eraseHomestaySearchHistory()) // Prevent side effects of rehydration
          dispatch(performRoomSearch(Object.assign({}, homestaySearchUrlToParams(this.props.routing.query), {
            mapData: {
              bounds: {
                maxLat: -15.5,
                maxLng: -19.1,
                minLat: 79.8,
                minLng: 63.1,
              },
            },
          }), push))

        }
      }
    }
  }

  closeFiltersPanel = () => this.setState({ filtersPanelOpen: false })
  openFiltersPanel = () => this.setState({ filtersPanelOpen: true })

  handleMapChange = newGeometry => {

    const { dispatch, search } = this.props

    if (this.state.initialSearchPerformed && !search.loading) {
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

  handlePriceChange = (minPrice, maxPrice) => {
    const { dispatch, search } = this.props
    dispatch(performRoomSearch(Object.assign({}, search.params, {
      minPrice,
      maxPrice,
    })))
  }

  render() {

    console.log(this)
    const { filtersPanelOpen, mapDimensions } = this.state
    const { uiCurrency, t, search } = this.props

    const currency = search.data && search.data.params ? search.data.params.currency : uiCurrency

    // Determine whether to render the map (essentially a media query, but for rendering, not styles)
    let renderMap = true
    if (__CLIENT__ && typeof window !== 'undefined' && window.innerWidth <= 767) {
      renderMap = false
    }

    // Default settings
    let center = false
    let zoom = false

    // The map must be measured before it can be rendered
    if (mapDimensions.width && mapDimensions.height && search.params.mapData.bounds && search.params.mapData.bounds.maxLat) {
      const fittedBounds = fitBounds(
        abroadwithBoundsToGMAPBounds(search.params.mapData.bounds),
        { width: mapDimensions.width || 0, height: mapDimensions.height || 0 }
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
              <h5 style={styles.header}>{t('search.homestay_search_title')}</h5>
              <div style={styles.extrasContainer}>
                <OverlayTrigger
                  trigger='click'
                  placement='bottom'
                  overlay={(
                    <PriceSlider
                      currency={currency}
                      handlePriceChange={this.handlePriceChange}
                      maxPrice={search.params.maxPrice}
                      minPrice={search.params.minPrice}
                    />
                  )}
                  rootClose
                >
                  <div style={styles.extra}>{t('search.price_range')}</div>
                </OverlayTrigger>
                <div style={styles.extra} onClick={this.openFiltersPanel}>{t('search.more_filters')}</div>
              </div>
            </div>
            <div style={styles.inlineSearchUnit}>
              <InlineSearchUnit integrated />
            </div>
          </div>
          <div style={styles.resultScrollList}>
            <FiltersPanel
              handleClose={this.closeFiltersPanel}
              open={filtersPanelOpen}
            />
            <SpinLoader light noLoader show={search.loading}>
              <div>
                <ResultList
                  loaded={search.loaded}
                  currency={currency}
                  results={search.data.results}
                />
              </div>
            </SpinLoader>
          </div>
          {renderMap &&
            <Measure
              onMeasure={dimensions => {
                this.setState({ mapDimensions: dimensions })
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
          }
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
