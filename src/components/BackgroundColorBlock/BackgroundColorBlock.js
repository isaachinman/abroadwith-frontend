// Imports
import React, { Component, PropTypes } from 'react'

// Styles
const styles = {
  baseStyle: {
    zIndex: -1,
    position: 'absolute',
    width: '100%',
    left: 0,
    bottom: 0,
  },
}

export default class BackgroundColorBlock extends Component {

  render() {
    const { color, minHeight } = this.props
    return (
      <div style={Object.assign({}, styles.baseStyle, { background: color, minHeight })} />
    )
  }

}

BackgroundColorBlock.propTypes = {
  color: PropTypes.string.isRequired,
  minHeight: PropTypes.number.isRequired,
}
