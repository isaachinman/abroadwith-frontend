// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Footer } from 'components'
import { translate } from 'react-i18next'

// Relative imports
import Pagination from './Pagination'
import Result from './Result'
import styles from '../SearchCourses.styles'

@translate()
export default class ResultList extends Component {

  render() {

    const { currency, loaded, t, numberOfResults, results, startLevel } = this.props

    return (
      <div>
        <div style={styles.resultListMinHeight}>
          {results && results.length > 0 && results.map(result => {
            return (
              <Result key={result.courseId} currency={currency} result={result} startLevel={startLevel} />
            )
          })}
          {numberOfResults !== null && loaded && results && results.length === 0 &&
            <div style={styles.noResults}>
              <h6 className='header-green'>{t('search.no_course_results_found')}</h6>
            </div>
          }
        </div>
        <div>
          {loaded &&
            <Pagination />
          }
        </div>
        <div className='text-muted'><small>{t('search.number_of_results_found', { number: numberOfResults })}</small></div>
        <div style={{ marginRight: -20 }}>
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
  numberOfResults: PropTypes.number,
  results: PropTypes.array,
  startLevel: PropTypes.string,
}
