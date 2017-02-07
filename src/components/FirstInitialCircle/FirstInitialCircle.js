// Absolute imports
import React, { PropTypes } from 'react'

// Relative imports
import styles from './FirstInitialCircle.styles'

export default function FirstInitialCircle(props) {

  const { letter } = props

  return (
    <div style={styles.circle}>{letter}</div>
  )

}

FirstInitialCircle.propTypes = {
  letter: PropTypes.string,
}
