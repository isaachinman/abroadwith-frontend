// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Pagination } from 'react-bootstrap'
import { performCourseSearch } from 'redux/modules/ui/search/courseSearch'
import { push } from 'react-router-redux'


@connect(
  state => ({
    courseSearch: state.uiPersist.courseSearch,
  })
)
export default class SearchPagination extends Component {

  componentWillReceiveProps = (nextProps) => {

    // If a user is on a page greater than one and performs a new search that returns less results,
    // put them back on page 1 to be safe
    if (((this.props.courseSearch.params.pageOffset / this.props.courseSearch.params.pageSize) + 1) > 1 && this.props.courseSearch.data.resultDetails.numberOfResults !== nextProps.courseSearch.data.resultDetails.numberOfResults) {
      this.props.dispatch(performCourseSearch(Object.assign({}, this.props.courseSearch.params, {
        pageOffset: 0,
      }), push))
    }

  }

  handleChange = page => {

    // Dispatch new search
    const { dispatch, courseSearch } = this.props
    const newParams = Object.assign({}, courseSearch.params, {
      pageOffset: (courseSearch.params.pageSize * page) - courseSearch.params.pageSize,
    })
    dispatch(performCourseSearch(newParams, push))

    // Scroll result list to top
    document.getElementById('homestay-search-result-list').scrollTop = 0

  }

  render() {

    const { courseSearch } = this.props

    const activePage = (courseSearch.params.pageOffset / courseSearch.params.pageSize) + 1
    const numberOfPages = courseSearch.data && courseSearch.data.resultDetails ? Math.ceil(courseSearch.data.resultDetails.numberOfResults / courseSearch.params.pageSize) : 0
    return (
      <div>
        {numberOfPages > 1 &&
          <Pagination
            activePage={activePage}
            items={numberOfPages}
            prev
            next
            first
            last
            ellipsis
            maxButtons={5}
            onSelect={this.handleChange}
          />
        }
      </div>
    )
  }
}

SearchPagination.propTypes = {
  dispatch: PropTypes.func,
  courseSearch: PropTypes.object,
}
