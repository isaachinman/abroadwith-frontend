// --------------------------------------------------------------------------------
// InlineSearchUnit, used sitewide to perform searches for both product types
// Has two layouts: standalone and integrated (for use within search pages)
// --------------------------------------------------------------------------------

// Absolute imports
import React, { Component, PropTypes } from 'react'
import { apiDate } from 'utils/dates'
import { connect } from 'react-redux'
import CourseCategories from 'data/constants/CourseCategories'
import { Button } from 'react-bootstrap'
import { DateRangePicker } from 'components'
import i18n from 'i18n/i18n-client'
import { loadCourseCities, loadCourseLanguages, updateCourseSearchParams, performCourseSearch } from 'redux/modules/ui/search/courseSearch'
import { SimpleSelect as Select } from 'react-selectize'
import MapBounds from 'data/constants/MapBounds'
import moment from 'moment'
import Radium from 'radium'
import shallowCompare from 'react-addons-shallow-compare'
import { translate } from 'react-i18next'
import { Typeahead } from 'react-bootstrap-typeahead'
import { updateRoomSearchParams, performRoomSearch } from 'redux/modules/ui/search/homestaySearch'
import { push } from 'react-router-redux'
import { pulseOpposite } from 'utils/animation'

// Relative imports
import LocationSearch from './subcomponents/LocationSearch'

// Animation styles
const animation = {
  pulseOpposite: {
    animation: 'x 0.2s',
    animationName: Radium.keyframes(pulseOpposite, 'pulseOpposite'),
  },
}

@connect(state => ({
  courseSearch: state.uiPersist.courseSearch,
  uiLanguage: state.ui.locale.value,
  homestaySearch: state.uiPersist.homestaySearch,
}))
@translate()
@Radium
export default class InlineSearchUnit extends Component {

  state = {
    loadingAnimation: false,
  }

  componentDidMount = () => {

    const { courseSearch, dispatch, type } = this.props

    if (type === 'course') {

      if (courseSearch.citiesAvailable.length === 0) {
        dispatch(loadCourseCities())
      }

      if (courseSearch.languagesAvailable.length === 0) {
        dispatch(loadCourseLanguages())
      }

    }

  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  handleValueChange = (field, value) => {

    const { dispatch, integrated, type } = this.props

    // Keep all variables and functions flexible
    const params = type === 'homestay' ? this.props.homestaySearch : this.props.courseSearch
    const updateParams = type === 'homestay' ? updateRoomSearchParams : updateCourseSearchParams
    const performSearch = type === 'homestay' ? performRoomSearch : performCourseSearch

    let newParams

    if (field === 'dates') {

      // The dates input returns both dates at once
      newParams = Object.assign({}, params, {
        arrival: value.startDate ? apiDate(value.startDate) : null,
        departure: value.endDate ? apiDate(value.endDate) : null,
      })

    } else if (field === 'location') {

      console.log('inside location change function: ', value)

      if (value !== null) {

        let mapData = {}

        if (type === 'homestay') {

          // The geolocation input returns complex data
          const { viewport, location } = value.geometry

          // Larger places come with a viewport object from Google
          if (viewport) {

            mapData.bounds = {
              maxLat: viewport.f.f,
              maxLng: viewport.b.b,
              minLat: viewport.f.b,
              minLng: viewport.b.f,
            }

          } else {

            // Smaller places, like specific addresses, do not
            mapData = {
              bounds: null,
              center: {
                lat: location.lat(),
                lng: location.lng(),
              },
              zoom: 15,
            }

          }

          newParams = Object.assign({}, params, {
            mapData,
            locationString: value.formatted_address,
          })

        } else if (type === 'course') {

          // Course cities already have predetermined coords
          mapData = {
            bounds: null,
            center: {
              lat: value.coords.lat,
              lng: value.coords.lng,
            },
            locationString: value.label,
            zoom: 15,
          }

        }

      } else {

        // If the value is null (input was just cleared), wipe data
        newParams = Object.assign({}, params, {
          mapData: {},
          locationString: null,
        })

      }

    } else {

      // Some inputs return simple values
      newParams = Object.assign({}, params, {
        [field]: value,
      })

    }

    if (integrated) {

      // Don't dispatch search until we have a proper date range
      if (field !== 'dates' || (field === 'dates' && value.startDate && value.endDate)) {
        dispatch(performSearch(newParams, push))
      } else {
        dispatch(updateParams(newParams))
      }

    } else {

      // If not integrated (on a search page), just update params, don't perform a search yet
      dispatch(updateParams(newParams))

    }

  }

  handleGoToSearchPage = () => {

    const { dispatch, homestaySearch } = this.props
    const params = Object.assign({}, homestaySearch.params)

    // If there's no location data, set it to default
    if (!params.mapData.bounds) {
      params.mapData.bounds = MapBounds.europe
    }

    this.setState({ loadingAnimation: true })
    dispatch(performRoomSearch(params, push))
  }

  render() {

    console.log(this)

    const { loadingAnimation } = this.state
    const { courseSearch, homestaySearch, uiLanguage, standalone, integrated, shadow, t, type } = this.props

    const searchLoading = type === 'homestay' ? homestaySearch.loading : courseSearch.loading

    // Determine languages available
    let allLanguages = []

    if (type === 'homestay' && i18n.store.data[uiLanguage]) {
      allLanguages = Object.entries(i18n.store.data[uiLanguage].translation.languages).map(([id, label]) => ({ id, label }))
    } else if (type === 'course') {
      allLanguages = courseSearch.languagesAvailable.map(lang => ({ id: lang, label: t(`languages.${lang}`) }))
    }

    let topLevelClassName = 'inline-search-unit'

    if (standalone) {
      topLevelClassName += ' standalone'
    }

    if (integrated) {
      topLevelClassName += ' integrated'
    }

    if (shadow) {
      topLevelClassName += ' shadow'
    }

    // Determine placeholder texts
    let languagesPlaceholder = t('search.language_to_learn')
    if (integrated) {
      languagesPlaceholder = t('search.language_to_learn_mobile')
    }
    if (type === 'course') {
      languagesPlaceholder = t('search.choose_a_language')
    }

    // Determine course categories based on language
    const courseCategories = []
    if (type === 'course') {

      CourseCategories.general_categories.map(category => courseCategories.push({ value: category, label: t(`course_categories.GENERAL_CATEGORIES.${category}`) }))

      if (['en', 'de', 'es'].includes(courseSearch.language)) {
        // Add language specific categories
      }

    }

    return (
      <div style={loadingAnimation ? animation.pulseOpposite : null} className={topLevelClassName}>

        <Typeahead
          tabIndex={1}
          className={type === 'course' ? 'course-language' : ''}
          selected={homestaySearch.params.language ? [{ label: t(`languages.${homestaySearch.params.language}`), id: homestaySearch.params.language }] : []}
          placeholder={languagesPlaceholder}
          options={allLanguages}
          onChange={options => {
            return options[0] ? this.handleValueChange('language', options[0].id) : this.handleValueChange('language', null)
          }}
        />

        {/* Geolocation search is only for homestays */}
        {type === 'homestay' &&
          <LocationSearch
            integrated={integrated}
            defaultValue={homestaySearch.params.locationString}
            handleValueChange={this.handleValueChange}
          />
        }

        {/* Courses have a predetermined list of available cities */}
        {type === 'course' &&
          <Typeahead
            className='course-city'
            tabIndex={1}
            selected={[]}
            placeholder={t('search.choose_a_city')}
            options={courseSearch.citiesAvailable.map(city => ({ id: city.name, label: t(`course_cities.${city.name}`), coords: { lat: city.location_0_coordinate, lng: city.location_1_coordinate } }))}
            onChange={options => {
              return options[0] ? this.handleValueChange('location', options[0]) : this.handleValueChange('location', null)
            }}
          />
        }

        <DateRangePicker
          inlineBlock
          large
          startDate={homestaySearch.params.arrival ? moment(homestaySearch.params.arrival) : null}
          endDate={homestaySearch.params.departure ? moment(homestaySearch.params.departure) : null}
          startDatePlaceholderText={type === 'homestay' ? t('common.Arrival') : t('search.start_date')}
          endDatePlaceholderText={type === 'homestay' ? t('common.Departure') : t('search.end_date')}
          onDatesChange={datesObject => this.handleValueChange('dates', datesObject)}
          scrollToPosition={standalone}
        />

        {/* Guest count is only for homestays */}
        {type === 'homestay' &&
          <Select
            theme='bootstrap3'
            value={{ value: homestaySearch.params.guests, label: homestaySearch.params.guests === 1 ? `1 ${t('common.guest')}` : `${homestaySearch.params.guests} ${t('common.guests')}` }}
            onValueChange={event => this.handleValueChange('guests', event ? event.value : 1)}
          >
            <option value={1}>{`1 ${t('common.guest')}`}</option>
            <option value={2}>{`2 ${t('common.guests')}`}</option>
            <option value={3}>{`3 ${t('common.guests')}`}</option>
          </Select>
        }

        {/* Course category selection is only for courses */}
        {type === 'course' &&
          <Select
            className='course-category'
            placeholder={t('booking.course_categories')}
            theme='bootstrap3'
            options={courseCategories}
          />
        }

        {standalone &&
        <Button
          disabled={searchLoading}
          onMouseDown={this.handleGoToSearchPage}
          bsSize='large'
          className='search-btn'
        >
          {searchLoading ? <span>{t('common.Loading')}</span> : <span>{t('common.search')}</span>}
        </Button>
          }

      </div>

    )
  }
}

InlineSearchUnit.propTypes = {
  courseSearch: PropTypes.object,
  dispatch: PropTypes.func,
  homestaySearch: PropTypes.object,
  uiLanguage: PropTypes.string,
  standalone: PropTypes.bool,
  shadow: PropTypes.bool,
  integrated: PropTypes.bool,
  t: PropTypes.func,
  type: PropTypes.string.isRequired,
}
