// Absolute imports
import React, { Component } from 'react'
import config from 'config'

// Relative imports
import styles from './Logo.styles'

export default class Logo extends Component {

  state = {
    smaller: false,
  }

  handleClick = () => {
    this.setState({ smaller: true }, () => setTimeout(() => this.setState({ smaller: false }), 200))
  }

  render() {

    const { componentStyle, size, color } = this.props // eslint-disable-line no-shadow
    const src = color === 'blue' ? `${config.img}/app/logo/abroadwith_logo_blue.png` : ''

    const imageStyles = {
      transition: 'width .1s',
      width: this.state.smaller ? '95%' : '100%',
    }

    return (
      <span onMouseDown={this.handleClick} style={Object.assign({}, styles.logoContainer, { maxWidth: size }, componentStyle)}>
        <img src={src} alt='Abroadwith' style={imageStyles} />
      </span>
    )
  }


}

Logo.propTypes = {
  componentStyle: React.PropTypes.object,
  size: React.PropTypes.number.isRequired,
  color: React.PropTypes.string.isRequired,
}
