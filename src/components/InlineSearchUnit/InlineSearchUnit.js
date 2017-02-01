// --------------------------------------------------------------------------------
// InlineSearchUnit, used sitewide to perform searches for both product types
// Has two layouts: standalone and integrated (for use within search pages)
// --------------------------------------------------------------------------------

// Absolute imports
import React, { Component, PropTypes } from 'react'
import { apiDate } from 'utils/dates'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { DateRangePicker } from 'components'
import i18n from 'i18n/i18n-client'
import { SimpleSelect as Select } from 'react-selectize'
import moment from 'moment'
import { translate } from 'react-i18next'
import { Typeahead } from 'react-bootstrap-typeahead'
import { updateRoomSearchParams, performRoomSearch } from 'redux/modules/ui/search/homestaySearch'
import { push } from 'react-router-redux'

// Relative imports
import LocationSearch from './subcomponents/LocationSearch'

@connect(state => ({
  uiLanguage: state.ui.locale.value,
  homestaySearch: state.ui.homestaySearch,
}))
@translate()
export default class InlineSearchUnit extends Component {

  handleValueChange = (field, value) => {

    const { dispatch, integrated } = this.props
    const { params } = this.props.homestaySearch
    let newParams

    if (field === 'dates') {

      // The dates input returns both dates at once
      newParams = Object.assign({}, params, {
        arrival: value.startDate ? apiDate(value.startDate) : null,
        departure: value.endDate ? apiDate(value.endDate) : null,
      })

    } else if (field === 'location') {

      // The location input returns complex data
      const { viewport, location } = value.geometry

      let mapData = {}

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

    } else {

      // Two inputs return simple values
      newParams = Object.assign({}, params, {
        [field]: value,
      })

    }

    if (integrated) {
      dispatch(performRoomSearch(newParams, push))
    } else {
      dispatch(updateRoomSearchParams(newParams))
    }

  }

  handleGoToSearchPage = () => {
    const { dispatch, homestaySearch } = this.props
    dispatch(performRoomSearch(homestaySearch.params, push))
  }

  render() {

    const { homestaySearch, uiLanguage, standalone, integrated, shadow, t } = this.props
    const searchLoading = homestaySearch.loading
    const allLanguages = Object.entries(i18n.store.data[uiLanguage].translation.languages).map(([id, label]) => ({ id, label }))

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

    return (
      <div className={topLevelClassName}>
        <Typeahead
          selected={homestaySearch.params.language ? [{ label: t(`languages.${homestaySearch.params.language}`), id: homestaySearch.params.language }] : []}
          placeholder={t('search.language_to_learn')}
          options={allLanguages}
          onChange={options => {
            return options[0] ? this.handleValueChange('language', options[0].id) : this.handleValueChange('language', null)
          }}
        />
        <LocationSearch
          defaultValue={homestaySearch.params.locationString}
          handleValueChange={this.handleValueChange}
        />
        <DateRangePicker
          inlineBlock
          large
          startDate={homestaySearch.params.arrival ? moment(homestaySearch.params.arrival) : null}
          endDate={homestaySearch.params.departure ? moment(homestaySearch.params.departure) : null}
          startDatePlaceholderText={t('common.Arrival')}
          endDatePlaceholderText={t('common.Departure')}
          onDatesChange={datesObject => this.handleValueChange('dates', datesObject)}
        />
        <Select
          theme='bootstrap3'
          value={{ value: 1, label: '1 guest' }}
        >
          <option value={1}>1</option>
        </Select>

        {standalone &&
        <Button
          disabled={searchLoading}
          onClick={this.handleGoToSearchPage}
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
  dispatch: PropTypes.func,
  homestaySearch: PropTypes.object,
  uiLanguage: PropTypes.string,
  standalone: PropTypes.bool,
  shadow: PropTypes.bool,
  integrated: PropTypes.bool,
  t: PropTypes.func,
}
