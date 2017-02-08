// Absolute imports
import React, { Component, PropTypes } from 'react'
import { babyBlue } from 'styles/colors'
import { connect } from 'react-redux'
import LoadingBar, { showLoading, hideLoading } from 'react-redux-loading-bar'

@connect()
export default class Loader extends Component {

  componentDidMount = () => {
    const { dispatch, history } = this.props
    history.listen(() => {
      dispatch(showLoading())
      setTimeout(() => {
        dispatch(hideLoading())
      }, 600)
    })
  }

  render() {

    console.log(this)

    return (
      <LoadingBar
        updateTime={50} maxProgress={95} progressIncrease={5}
        style={{ backgroundColor: babyBlue, height: 2, zIndex: 999999 }}
      />
    )
  }
}

Loader.propTypes = {
  dispatch: PropTypes.func,
  history: PropTypes.object,
}
