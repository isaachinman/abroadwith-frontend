// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import shortid from 'shortid'

// Relative imports
import Result from './Result'

@translate()
export default class ResultList extends Component {
  render() {

    const { currency, results } = this.props

    return (
      <div>
        {results && results.length > 0 && results.map(result => {
          return (
            <Result key={shortid()} currency={currency} result={result} />
          )
        })}
      </div>
    )
  }
}

ResultList.propTypes = {
  currency: PropTypes.string,
  t: PropTypes.func,
  results: PropTypes.array,
}
