// Absolute imports
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Footer } from 'components'
import { translate } from 'react-i18next'

// Relative imports
import Pagination from './Pagination'
import Result from './Result'
import styles from '../SearchHomestays.styles'

@translate()
export default class ResultList extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {

    const { currency, loaded, t, numberOfResults, results } = this.props

    console.log('ResultList Rendering', this.props)

    return (
      <div>
        <div style={styles.resultListMinHeight}>
          {results && results.length > 0 && results.map(result => {
            return (
              <Result key={result.roomId} currency={currency} result={result} />
            )
          })}
          {numberOfResults !== null && loaded && results && results.length === 0 &&
            <div style={styles.noResults}>
              <h6 className='header-green'>{t('search.no_results_found')}</h6>
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
}
