// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

@connect()
export default class CourseBooking extends Component {

  render() {

    // const { t } = this.props

    return (
      <div>
        {this.props.id}
      </div>
    )
  }
}

CourseBooking.propTypes = {
  dispatch: PropTypes.func,
  id: PropTypes.number,
}
