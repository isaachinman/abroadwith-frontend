// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Footer } from 'components'
import { translate } from 'react-i18next'
import shortid from 'shortid'

// Relative imports
import Pagination from './Pagination'
import Result from './Result'
import styles from '../SearchHomestays.styles'

@translate()
export default class ResultList extends Component {
  render() {

    const { currency, loaded, t, results } = this.props

    return (
      <div>
        <div style={styles.resultListMinHeight}>
          {results && results.length > 0 && results.map(result => {
            return (
              <Result key={shortid()} currency={currency} result={result} />
            )
          })}
          {loaded && results && results.length === 0 &&
            <div style={styles.noResults}>
              <h6 className='header-green'>{t('search.no_results_found')}</h6>
            </div>
          }
        </div>
        <div style={styles.pagination}>
          <Pagination />
        </div>
        <div style={{ marginRight: -10 }}>
          <Footer compact />
        </div>
      </div>
    )
  }
}

ResultList.propTypes = {
  currency: PropTypes.string,
  loaded: PropTypes.bool,
  t: PropTypes.func,
  results: PropTypes.array,
}
