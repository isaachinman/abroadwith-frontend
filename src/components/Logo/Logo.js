// Absolute imports
import React from 'react'
import config from 'config'

// Relative imports
import styles from './Logo.styles'

export default function Logo(props) {

  const { componentStyle, size, color } = props // eslint-disable-line no-shadow

  const src = color === 'blue' ? `${config.img}/app/logo/abroadwith_logo_blue.png` : ''

  return (
    <span style={Object.assign({}, styles.logoContainer, { maxWidth: size }, componentStyle)}>
      <img src={src} alt='Abroadwith' style={styles.image} />
    </span>
  )

}

Logo.propTypes = {
  componentStyle: React.PropTypes.object,
  size: React.PropTypes.number.isRequired,
  color: React.PropTypes.string.isRequired,
}
