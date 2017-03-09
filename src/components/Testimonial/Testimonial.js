// Absolute imports
import React, { Component, PropTypes } from 'react'
import config from 'config'
import { Link } from 'react-router'
import Radium from 'radium'
import { translate } from 'react-i18next'

// Relative imports
import styles from './Testimonials.styles'

// Colour map
const colorMap = {
  daniel: 'pink',
  isabel: 'blue',
  oliver: 'green',
  marco: 'pink',
  sue: 'blue',
  francois: 'green',
  esther: 'pink',
  cathy: 'blue',
  lola: 'green',
  julien: 'pink',
  jonathan: 'blue',
  brian: 'green',
  giulia: 'green',
}

// ID map (for links)
const idMap = {
  esther: 1734,
  cathy: 3,
  lola: 218,
  julien: 56,
  jonathan: 1748,
}

@translate()
@Radium
export default class Testimonial extends Component {

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
          <p dangerouslySetInnerHTML={{
            __html: t(`testimonials.${type}_testimonials.${person}.description`),
          }}
          />
          {type === 'host' &&
            <p>
              <Link to={`/${type === 'student' ? 'user' : 'homestay'}/${idMap[person]}`}>
                {t('testimonials.host_home_link', { host: person.charAt(0).toUpperCase() + person.slice(1).toLowerCase() })}
              </Link>
            </p>
          }
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
