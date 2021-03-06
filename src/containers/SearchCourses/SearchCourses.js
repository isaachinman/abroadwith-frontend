// Absolute imports
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import Helmet from 'react-helmet'
import abroadwithBoundsToGMAPBounds from 'utils/search/abroadwithBoundsToGMAPBounds'
import { browserHistory } from 'react-router'
import { getBoundsFromLocationString } from 'utils/locations'
import gmapBoundsToAbroadwithBounds from 'utils/search/gmapBoundsToAbroadwithBounds'
import { connect } from 'react-redux'
import { InlineSearchUnit } from 'components'
import { Grid, OverlayTrigger } from 'react-bootstrap'
import courseSearchUrlToParams from 'utils/search/courseSearchUrlToParams'
import MapBounds from 'data/constants/MapBounds'
import Measure from 'react-measure'
import { translate } from 'react-i18next'
import { fitBounds } from 'google-map-react/utils'
import { coursePopoverClose, courseResultMouseLeave } from 'redux/modules/ui/search/hoverables'
import { eraseCourseSearchHistory, performCourseSearch } from 'redux/modules/ui/search/courseSearch'
import { push } from 'react-router-redux'
import Radium from 'radium'
import SpinLoader from 'components/SpinLoader/SpinLoader'

// Relative imports
import CategorySelection from './subcomponents/CategorySelection'
import Map from './subcomponents/Map'
import PriceSlider from './subcomponents/PriceSlider'
import ResultList from './subcomponents/ResultList'
import styles from './SearchCourses.styles'

@connect(
  state => ({
    uiCurrency: state.ui.currency.value,
    search: state.uiPersist.courseSearch,
    uiLanguage: state.ui.locale.value,
    routing: state.routing.locationBeforeTransitions,
  })
)
@translate()
@Radium
export default class SearchCourses extends Component {

  state = {
    initialSearchPerformed: false,
    mapDimensions: {},
  }

  componentDidMount = () => {

    // Add listener for browser navigation (primarily to support backwards navigation)
    this.navListener = browserHistory.listen(location => {

      // Application-caused location changes are PUSH, while browser events are POP
      if (location.action === 'POP') {
        this.props.dispatch(performCourseSearch(courseSearchUrlToParams(location.query)))
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

          dispatch(performCourseSearch(Object.assign({}, courseSearchUrlToParams(this.props.routing.query), {
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

          dispatch(performCourseSearch(courseSearchUrlToParams(this.props.routing.query)))

        } else {

          // If there are no bounds in the query, hydrate any remaining query params,
          // and append some default location variables
          dispatch(eraseCourseSearchHistory()) // Prevent side effects of rehydration
          dispatch(performCourseSearch(Object.assign({}, courseSearchUrlToParams(this.props.routing.query), {
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

    if (prevProps.search.params.locationString !== this.props.search.params.locationString) {
      this.calculateMapData(this.state.mapDimensions)
    }

  }

  componentWillUnmount = () => this.navListener()

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

  closeFiltersPanel = () => this.setState({ filtersPanelOpen: false })
  openFiltersPanel = () => this.setState({ filtersPanelOpen: true })

  handleCategoryChange = values => {

    const { dispatch, search } = this.props
    const categories = values.map(category => category.value)
    dispatch(performCourseSearch(Object.assign({}, search.params, {
      categories,
    }), push))

  }

  handleMapChange = newGeometry => {

    const { dispatch, search } = this.props

    if (this.state.initialSearchPerformed && !search.loading) {
      dispatch(performCourseSearch(Object.assign({}, search.params, {
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
      dispatch(coursePopoverClose())
      dispatch(courseResultMouseLeave())
    }

  }

  handlePriceChange = maxWeeklyPrice => {
    const { dispatch, search } = this.props
    dispatch(performCourseSearch(Object.assign({}, search.params, {
      maxWeeklyPrice,
    }), push))
  }

  render() {

    const { uiCurrency, t, search } = this.props

    const currency = search.data && search.data.params ? search.data.params.currency : uiCurrency

    // Determine whether to render the map (essentially a media query, but for rendering, not styles)
    let renderMap = true
    if (__CLIENT__ && typeof window !== 'undefined' && window.innerWidth <= 767) {
      renderMap = false
    }

    console.log(this)

    return (
      <div>
        <Helmet title={t('search.course_title')} />
        <Grid style={styles.grid}>
          <div style={styles.controls}>
            <div style={styles.headerBg}>
              <h5 style={styles.header}>{t('search.courses_h1')}</h5>
              <div style={styles.extrasContainer}>
                <OverlayTrigger
                  trigger='click'
                  placement='bottom'
                  overlay={(
                    <CategorySelection
                      handleCategoryChange={this.handleCategoryChange}
                      categories={search.params.categories}
                      language={search.params.language}
                    />
                  )}
                  rootClose
                >
                  <div style={styles.extra}>{t('booking.course_categories')}{search.params.categories.length > 0 && <span> ({search.params.categories.length})</span>}</div>
                </OverlayTrigger>
                <OverlayTrigger
                  trigger='click'
                  placement='bottom'
                  overlay={(
                    <PriceSlider
                      currency={currency}
                      handlePriceChange={this.handlePriceChange}
                      maxPrice={parseInt(search.params.maxWeeklyPrice)}
                    />
                  )}
                  rootClose
                >
                  <div style={styles.extra}>{t('search.price_range')}</div>
                </OverlayTrigger>
              </div>
            </div>
            <div style={styles.inlineSearchUnit}>
              <InlineSearchUnit type='course' integrated />
            </div>
          </div>
          <div style={styles.resultScrollList} id='homestay-search-result-list'>
            <SpinLoader light noLoader show={search.loading}>
              <div>
                <ResultList
                  loaded={search.loaded}
                  currency={currency}
                  results={search.data.results}
                  numberOfResults={search.data && search.data.resultDetails ? search.data.resultDetails.numberOfResults : null}
                  startLevel={search.params.level}
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

SearchCourses.propTypes = {
  dispatch: PropTypes.func,
  search: PropTypes.object,
  routing: PropTypes.object,
  t: PropTypes.func,
  uiCurrency: PropTypes.string,
  uiLanguage: PropTypes.string,
}
