// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col } from 'react-bootstrap'
import { darkBlue } from 'styles/colors'
import { Link } from 'react-router'
import { translate } from 'react-i18next'

// Relative imports
const styles = {
  link: {
    textDecoration: 'none',
  },
  panel: {
    borderRadius: 5,
    background: darkBlue,
    display: 'table',
    width: '100%',
    height: 200,
    marginBottom: 30,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  cityName: {
    display: 'table-cell',
    verticalAlign: 'middle',
    textAlign: 'center',
    color: 'white',
  },
}

@translate()
export default class CityPanel extends Component {

  render() {

    const { cityName, t } = this.props

    return (
      <Col xs={12} sm={6}>
        <Link to={`/language-homestay/search?locationString=${encodeURI(cityName)}`} style={styles.link}>
          <div style={styles.panel}>
            <div style={styles.cityName}>
              <h5>{t(`cities.${(cityName).replace(/ /g, '_')}`)}</h5>
            </div>
          </div>
        </Link>
      </Col>
    )
  }
}

CityPanel.propTypes = {
  cityName: PropTypes.string,
  t: PropTypes.func,
}
