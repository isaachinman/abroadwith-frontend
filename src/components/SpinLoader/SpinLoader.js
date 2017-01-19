import React, { Component, PropTypes } from 'react'
import Loader from 'react-loader-advanced'
import Spinner from './Spinner'

export default class SpinLoader extends Component {

  render() {

    return (
      <Loader
        contentBlur={1}
        backgroundStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
        show={this.props.show}
        message={<Spinner delay={500} type='spin' color='#fff' />}
      >
        {this.props.children}
      </Loader>

    )
  }
}

SpinLoader.propTypes = {
  children: PropTypes.element,
  show: PropTypes.bool,
}
