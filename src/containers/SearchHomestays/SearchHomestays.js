// Absolute imports
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import Helmet from 'react-helmet'
import abroadwithBoundsToGMAPBounds from 'utils/search/abroadwithBoundsToGMAPBounds'
import { browserHistory } from 'react-router'
import gmapBoundsToAbroadwithBounds from 'utils/search/gmapBoundsToAbroadwithBounds'
import { connect } from 'react-redux'
import { InlineSearchUnit } from 'components'
import { getBoundsFromLocationString } from 'utils/locations'
import { Grid, OverlayTrigger } from 'react-bootstrap'
import homestaySearchUrlToParams from 'utils/search/homestaySearchUrlToParams'
import MapBounds from 'data/constants/MapBounds'
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
import ImmersionSelection from './subcomponents/ImmersionSelection'
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

  componentDidMount = () => {

    // Add listener for browser navigation (primarily to support backwards navigation)
    this.navListener = browserHistory.listen(location => {

      // Application-caused location changes are PUSH, while browser events are POP
      if (location.action === 'POP') {
        this.props.dispatch(performRoomSearch(homestaySearchUrlToParams(location.query)))
      }

    })

  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillUpdate = (nextProps, nextState) => {

    const { dispatch, routing, search } = this.props

    // This is our initialisation step
    if (!this.state.mapDimensions.width && nextState.mapDimensions.width && !this.state.initialSearchPerformed) {

      this.calculateMapData(nextState.mapDimensions)

      // In some cases, we link to this search page with a semantic location query
      if (routing.query.locationString && !routing.query.maxLat) {

        getBoundsFromLocationString(routing.query.locationString).then(bounds => {
          dispatch(performRoomSearch(Object.assign({}, homestaySearchUrlToParams(this.props.routing.query), {
            mapData: {
              bounds,
            },
          }), push))
        })

      } else if (!search.loaded && !search.params.mapData.bounds) {

        // We will assume that if there aren't bounds in the store, and no data has been loaded,
        // the user isn't already inside a search process

        // If there are bounds in the query, hydrate the entire query
        if (routing.query.maxLat && routing.query.maxLng && routing.query.minLat && routing.query.minLng) {

          dispatch(performRoomSearch(homestaySearchUrlToParams(this.props.routing.query)))

        } else {

          // If there are no bounds in the query, hydrate any remaining query params,
          // and append some default location variables
          dispatch(eraseHomestaySearchHistory()) // Prevent side effects of rehydration
          dispatch(performRoomSearch(Object.assign({}, homestaySearchUrlToParams(this.props.routing.query), {
            mapData: {
              bounds: MapBounds.europe,
            },
          })))

        }

        this.setState({ initialSearchPerformed: true })

      }
    }
  }

  componentDidUpdate = prevProps => {

    // If user selected new location from autocomplete input, move map
    if (prevProps.search.params.locationString !== this.props.search.params.locationString) {
      this.calculateMapData(this.state.mapDimensions)
    }

  }

  componentWillUnmount = () => this.navListener()

  closeFiltersPanel = () => this.setState({ filtersPanelOpen: false })
  openFiltersPanel = () => this.setState({ filtersPanelOpen: true })

  handleMapChange = newGeometry => {

    const { dispatch, search } = this.props

    if (this.state.initialSearchPerformed && !search.loading) {
      dispatch(performRoomSearch(Object.assign({}, search.params, {
        mapData: {
          bounds: gmapBoundsToAbroadwithBounds(newGeometry.bounds),
        },
      }), push))
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

  handleImmersionToggle = (immersion, value) => {
    const { dispatch, search } = this.props
    const newParams = Object.assign({}, search.params)
    newParams.immersions[immersion] = value
    if (immersion === 'tandem' && value === false) {
      newParams.tandemLanguage = null
    }
    dispatch(performRoomSearch(newParams, push))
  }

  handleTandemLanguageChange = value => {
    const { dispatch, search } = this.props
    dispatch(performRoomSearch(Object.assign({}, search.params, {
      tandemLanguage: value,
    }), push))
  }

  handlePriceChange = (minPrice, maxPrice) => {
    const { dispatch, search } = this.props
    dispatch(performRoomSearch(Object.assign({}, search.params, {
      minPrice,
      maxPrice,
    }), push))
  }

  calculateMapData = dimensions => {

    const { search } = this.props

    // The map must be measured before it can be rendered
    if (dimensions.width && dimensions.height && search.params.mapData.bounds && search.params.mapData.bounds.maxLat) {
      const fittedBounds = fitBounds(
        abroadwithBoundsToGMAPBounds(search.params.mapData.bounds),
        { width: dimensions.width || 0, height: dimensions.height || 0 }
      )
      this.mapCenter = fittedBounds.center
      this.mapZoom = fittedBounds.zoom
    }

  }

  render() {

    console.log(this)

    const { filtersPanelOpen } = this.state
    const { uiCurrency, uiLanguage, t, search } = this.props

    const currency = search.data && search.data.params ? search.data.params.currency : uiCurrency

    // Determine whether to render the map (essentially a media query, but for rendering, not styles)
    let renderMap = true
    if (__CLIENT__ && typeof window !== 'undefined' && window.innerWidth <= 767) {
      renderMap = false
    }

    // Compile number of "filters" currently applied
    let numOfFiltersApplied = search.params.filters.length
    if (search.params.homeType) {
      numOfFiltersApplied += search.params.homeType.length
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
                    <ImmersionSelection
                      toggleImmersion={this.handleImmersionToggle}
                      handleTandemLanguageChange={this.handleTandemLanguageChange}
                      tandemLanguage={search.params.tandemLanguage}
                      immersions={search.params.immersions}
                      uiLanguage={uiLanguage}
                    />
                  )}
                  rootClose
                >
                  <div style={styles.extra}>{t('common.immersions')}</div>
                </OverlayTrigger>
                <OverlayTrigger
                  trigger='click'
                  placement='bottom'
                  overlay={(
                    <PriceSlider
                      currency={currency}
                      handlePriceChange={this.handlePriceChange}
                      maxPrice={parseInt(search.params.maxPrice)}
                      minPrice={parseInt(search.params.minPrice)}
                    />
                  )}
                  rootClose
                >
                  <div style={styles.extra}>{t('search.price_range')}</div>
                </OverlayTrigger>
                <div style={styles.extra} onClick={this.openFiltersPanel}>{t('search.more_filters')}{numOfFiltersApplied > 0 && <span>&nbsp;({numOfFiltersApplied})</span>}</div>
              </div>
            </div>
            <div style={styles.inlineSearchUnit}>
              <InlineSearchUnit type='homestay' integrated />
            </div>
          </div>
          <div style={styles.resultScrollList} id='homestay-search-result-list'>
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
                  numberOfResults={search.data && search.data.resultDetails ? search.data.resultDetails.numberOfResults : null}
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
                {this.mapCenter && this.mapZoom &&
                  <Map
                    center={this.mapCenter}
                    currency={currency}
                    handleLocationChange={this.handleMapChange}
                    handleMapClick={this.handleMapClick}
                    zoom={this.mapZoom}
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
