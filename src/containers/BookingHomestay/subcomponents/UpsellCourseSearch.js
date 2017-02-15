// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Fade } from 'react-bootstrap'
import { connect } from 'react-redux'
import Currencies from 'data/constants/Currencies'
import { translate } from 'react-i18next'

// Relative imports
import CourseResult from './CourseResult'

// Styles
const styles = {
  contentContainer: {
    paddingLeft: 15,
    paddingRight: 30,
  },
}


@connect(
  state => ({
    upsellSearch: state.uiPersist.courseSearch.upsellSearch,
    uiCurrency: state.ui.currency.value,
  })
)
@translate()
export default class UpsellCourseSearch extends Component {

  render() {

    const { animationInProgress, uiCurrency, upsellSearch } = this.props

    const currencySymbol = Currencies[uiCurrency]

    return (
      <Fade in={!animationInProgress}>
        <div style={styles.contentContainer}>
          {upsellSearch.data && upsellSearch.data.results.length > 0 &&
            <div>
              {upsellSearch.data.results.map(result => {
                return (
                  <CourseResult animationInProgress={animationInProgress} key={`upsell-course-${result.courseId}`} currencySymbol={currencySymbol} result={result} />
                )
              })}
            </div>
          }
        </div>
      </Fade>
    )
  }
}

UpsellCourseSearch.propTypes = {
  animationInProgress: PropTypes.bool,
  dispatch: PropTypes.func,
  uiCurrency: PropTypes.string,
  upsellSearch: PropTypes.object,
  t: PropTypes.func,
}
