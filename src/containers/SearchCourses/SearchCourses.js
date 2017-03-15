// Absolute imports
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import Helmet from 'react-helmet'
import abroadwithBoundsToGMAPBounds from 'utils/search/abroadwithBoundsToGMAPBounds'
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

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillUpdate = (nextProps, nextState) => {

    const { dispatch, routing, search } = this.props

    // Course locations come from a predetermined list of center point coords
    // These need to be converted into bounds every single time

    console.log(this)
    console.log(this.props.search.params.locationString, nextProps.search.params.locationString)
    if (this.props.search.params.locationString !== nextProps.search.params.locationString && nextProps.search.params.locationString !== null) {

      console.log('inside new city case')

      // Instantiate the Google services we'll need
      /* eslint-disable */
      const autocompleter = new google.maps.places.AutocompleteService()
      const geocoder = new google.maps.Geocoder
      /* eslint-enable */

      // Get a place suggestion from the locationString
      autocompleter.getQueryPredictions({ input: nextProps.search.params.locationString }, (predictions, status) => {

        // Geolocate the first result
        if (status === 'OK' && predictions.length > 0) {

          geocoder.geocode({ placeId: predictions[0].place_id }, (results, geocodeStatus) => {

            if (geocodeStatus === 'OK' && results.length > 0) {

              const viewport = results[0].geometry.bounds

              dispatch(performCourseSearch(Object.assign({}, nextProps.search.params, {
                mapData: {
                  bounds: {
                    maxLat: viewport.f.f,
                    maxLng: viewport.b.b,
                    minLat: viewport.f.b,
                    minLng: viewport.b.f,
                  },
                },
              }), push))
            }

          })

        }

      })

    }

    // This is our initialisation step
    if (!this.state.mapDimensions.width && nextState.mapDimensions.width && !this.state.initialSearchPerformed) {

      // In some cases, we link to this search page with a semantic location query
      if (routing.query.locationString && !routing.query.maxLat) {

        // Instantiate the Google services we'll need
        /* eslint-disable */
        const autocompleter = new google.maps.places.AutocompleteService()
        const geocoder = new google.maps.Geocoder
        /* eslint-enable */

        // Get a place suggestion from the locationString
        autocompleter.getQueryPredictions({ input: routing.query.locationString }, (predictions, status) => {

          // Geolocate the first result
          if (status === 'OK' && predictions.length > 0) {

            geocoder.geocode({ placeId: predictions[0].place_id }, (results, geocodeStatus) => {

              if (geocodeStatus === 'OK' && results.length > 0) {

                const viewport = results[0].geometry.bounds

                dispatch(performCourseSearch(Object.assign({}, courseSearchUrlToParams(this.props.routing.query), {
                  mapData: {
                    bounds: {
                      maxLat: viewport.f.f,
                      maxLng: viewport.b.b,
                      minLat: viewport.f.b,
                      minLng: viewport.b.f,
                    },
                  },
                }), push))
              }

            })

          }

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

    const { mapDimensions } = this.state
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

SearchCourses.propTypes = {
  dispatch: PropTypes.func,
  search: PropTypes.object,
  routing: PropTypes.object,
  t: PropTypes.func,
  uiCurrency: PropTypes.string,
  uiLanguage: PropTypes.string,
}
