import React, { Component } from 'react'
import { ProgressBar as Bar } from 'react-bootstrap'

export default class ProgressBar extends Component {

  state = {
    percent: 0,
  }

  render() {

    const { percent } = this.state

    return (
      <Bar now={percent} />
    )

  }

}

ProgressBar.propTypes = {
  auto: React.PropTypes.bool,
}
