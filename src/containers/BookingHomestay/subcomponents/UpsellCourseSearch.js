// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

// Relative imports
// const styles = {}


@connect(
  state => ({
    upsellSearch: state.uiPersist.courseSearch.upsellSearch,
    uiCurrency: state.ui.currency.value,
  })
)
@translate()
export default class UpsellCourseSearch extends Component {

  render() {

    return (
      <div>Upsell Search</div>
    )
  }
}

UpsellCourseSearch.propTypes = {
  dispatch: PropTypes.func,
}
