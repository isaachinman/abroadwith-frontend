// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import config from 'config'
import Radium from 'radium'

// Relative imports
import styles from './Testimonials.styles'

// Colour map
const colorMap = {
  daniel: 'pink',
  isabel: 'blue',
}

@translate()
@Radium
export default class Testimonial extends Component {

  shouldComponentUpdate = () => false // Entirely static component

  render() {

    const { t, type, person } = this.props

    return (
      <div style={styles.panel}>
        <div style={styles.mainInfo}>
          <img src={`${config.img}/app/testimonials/${person}.jpg?w=200`} style={styles.img} alt={person} />
          <div style={styles.title} className='header-blue' dangerouslySetInnerHTML={{
            __html: t(`testimonials.${type}_testimonials.${person}.title`),
          }}
          />
        </div>
        <div style={styles.content}>
          <h5 className={`header-${colorMap[person]}`}>{t(`testimonials.${type}_testimonials.${person}.subtitle`)}</h5>
          <p>{t(`testimonials.${type}_testimonials.${person}.description`)}</p>
        </div>
      </div>
    )
  }

}

Testimonial.propTypes = {
  person: PropTypes.string,
  type: PropTypes.string,
  t: PropTypes.func,
}
