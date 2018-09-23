// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Fade, Pagination } from 'react-bootstrap'
import { connect } from 'react-redux'
import Currencies from 'data/constants/Currencies'
import { translate } from 'react-i18next'
import { performCourseUpsellSearch } from 'redux/modules/ui/search/courseSearch'

// Relative imports
import CourseResult from './subcomponents/CourseResult'
import styles from './UpsellCourseSearch.styles'


@connect(
  state => ({
    upsellSearch: state.uiPersist.courseSearch.upsellSearch,
    uiCurrency: state.ui.currency.value,
    token: state.auth.token,
  })
)
@translate()
export default class UpsellCourseSearch extends Component {

  handlePageChange = page => {

    // Dispatch new search
    const { dispatch, upsellSearch, token } = this.props
    const newParams = Object.assign({}, upsellSearch.params, {
      pageOffset: (upsellSearch.params.pageSize * page) - upsellSearch.params.pageSize,
    })
    dispatch(performCourseUpsellSearch(token, newParams))

  }

  render() {

    const { animationInProgress, uiCurrency, upsellSearch } = this.props

    const currencySymbol = Currencies[uiCurrency]
    const activePage = (upsellSearch.params.pageOffset / upsellSearch.params.pageSize) + 1
    const numberOfPages = upsellSearch.data && upsellSearch.data.resultDetails ? Math.ceil(upsellSearch.data.resultDetails.numberOfResults / upsellSearch.data.params.pageSize) : 0

    return (
      <Fade in={!animationInProgress}>
        <div>
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
          {upsellSearch.data && upsellSearch.data.results.length > 0 && upsellSearch.data.resultDetails.numberOfResults > upsellSearch.data.params.pageSize &&
            <Pagination
              activePage={activePage}
              bsSize='small'
              items={numberOfPages}
              prev
              next
              ellipsis
              maxButtons={5}
              onSelect={this.handlePageChange}
              style={{ marginBottom: -10 }}
            />
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
  token: PropTypes.string,
}
