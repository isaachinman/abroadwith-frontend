// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Pagination } from 'react-bootstrap'
import { performRoomSearch } from 'redux/modules/ui/search/homestaySearch'


@connect(
  state => ({
    homestaySearch: state.uiPersist.homestaySearch,
  })
)
export default class SearchPagination extends Component {

  componentWillReceiveProps = (nextProps) => {

    // If a user is on a page greater than one and performs a new search that returns less results,
    // put them back on page 1 to be safe
    if (((this.props.homestaySearch.params.pageOffset / this.props.homestaySearch.params.pageSize) + 1) > 1 && this.props.homestaySearch.data.resultDetails.numberOfResults !== nextProps.homestaySearch.data.resultDetails.numberOfResults) {
      this.props.dispatch(performRoomSearch(Object.assign({}, this.props.homestaySearch.params, {
        pageOffset: 0,
      })))
    }

  }

  handleChange = page => {

    // Dispatch new search
    const { dispatch, homestaySearch } = this.props
    const newParams = Object.assign({}, homestaySearch.params, {
      pageOffset: (homestaySearch.params.pageSize * page) - homestaySearch.params.pageSize,
    })
    dispatch(performRoomSearch(newParams))

    // Scroll result list to top
    document.getElementById('homestay-search-result-list').scrollTop = 0

  }

  render() {

    const { homestaySearch } = this.props

    const activePage = (homestaySearch.params.pageOffset / homestaySearch.params.pageSize) + 1
    const numberOfPages = homestaySearch.data && homestaySearch.data.resultDetails ? Math.ceil(homestaySearch.data.resultDetails.numberOfResults / homestaySearch.params.pageSize) : 0
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
  homestaySearch: PropTypes.object,
}
