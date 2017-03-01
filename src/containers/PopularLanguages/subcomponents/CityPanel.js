// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col } from 'react-bootstrap'
import config from 'config'
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
    textShadow: '-2px 3px 3px #333',
  },
}

@translate()
export default class CityPanel extends Component {

  render() {

    const { cityName, t } = this.props
    const pathSafeName = cityName.replace(/ /g, '_')

    return (
      <Col xs={12} sm={6}>
        <Link to={`/language-homestay/search?locationString=${encodeURI(cityName)}`} style={styles.link}>
          <div style={Object.assign({}, styles.panel, { backgroundImage: `url(${config.img}/static/cities/${pathSafeName}.jpg)` })}>
            <div style={styles.cityName}>
              <h4>{t(`cities.${pathSafeName}`)}</h4>
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
