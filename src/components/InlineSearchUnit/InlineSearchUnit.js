// --------------------------------------------------------------------------------
// InlineSearchUnit, used sitewide to perform searches for both product types
// Has two layouts: standalone and integrated (for use within search pages)
// --------------------------------------------------------------------------------

// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button, Form } from 'react-bootstrap'
import { DateRangePicker } from 'components'
import Geosuggest from 'react-geosuggest'
import i18n from 'i18n/i18n-client'
import { SimpleSelect as Select } from 'react-selectize'
import { translate } from 'react-i18next'
import { Typeahead } from 'react-bootstrap-typeahead'
import { push } from 'react-router-redux'

// Relative imports
import styles from './InlineSearchUnit.styles'

@connect(state => ({
  uiLanguage: state.ui.locale.value,
}))
@translate()
export default class InlineSearchUnit extends Component {

  handleGoToSearchPage = () => {
    this.props.dispatch(push('/language-homestay/search'))
  }

  render() {

    const { uiLanguage, standalone, integrated, t } = this.props
    const allLanguages = Object.entries(i18n.store.data[uiLanguage].translation.languages).map(([id, label]) => ({ id, label }))

    let topLevelClassName = 'inline-search-unit'

    if (standalone) {
      topLevelClassName += ' standalone'
    }

    if (integrated) {
      topLevelClassName += ' integrated'
    }

    return (
      <Form inline>
        <div className={topLevelClassName}>
          <Typeahead
            placeholder={t('search.language_to_learn')}
            options={allLanguages}
          />
          <Geosuggest
            placeholder={t('common.where')}
            inputClassName='form-control'
          />
          <DateRangePicker
            inlineBlock
            large
            startDatePlaceholderText='Arrival'
            endDatePlaceholderText='Departure'
          />
          <Select
            theme='bootstrap3'
            value={{ value: 1, label: '1 guest' }}
          >
            <option value={1}>1</option>
          </Select>

          {standalone &&
            <Button onClick={this.handleGoToSearchPage} bsSize='large' className='search-btn' style={styles.searchBtn}>{t('common.search')}</Button>
          }

        </div>

      </Form>
    )
  }
}

InlineSearchUnit.propTypes = {
  dispatch: PropTypes.func,
  uiLanguage: PropTypes.string,
  standalone: PropTypes.bool,
  integrated: PropTypes.bool,
  t: PropTypes.func,
}
