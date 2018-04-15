// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import config from 'config'

// Relative imports
import styles from './FeaturedHomes.styles'

// Data constant
const featuredHomes = [1, 2, 3]

@translate()
export default class FeaturedHomes extends Component {

  render() {

    const {
      t,
    } = this.props

    return (
      <div>
        <Row style={{ marginBottom: 30 }}>
          <Col xs={10} xsOffset={1} sm={8} smOffset={2} md={8} mdOffset={2}>
            <h3 className='header-green' style={styles.centerAlign}>{t('featured_homes.title')}</h3>
          </Col>
        </Row>
        <Row>
          {featuredHomes.map(home => {
            return (
              <Col xs={12} md={4} key={`featured_home_${home}`}>
                <div style={styles.container} className='featured-homestay'>
                  <Link style={styles.profileLink} />
                  <div style={Object.assign({}, styles.homePhoto, { backgroundImage: `url(${config.img}${t(`featured_homes.homestays.featured_home_${home}.home_image`)})` })} />
                  <h6 className='title' style={styles.title}>{t(`featured_homes.homestays.featured_home_${home}.title`)} <br /> <small>{t(`featured_homes.homestays.featured_home_${home}.location`)}</small></h6>
                  <h6 className='text-muted' style={styles.price}>{t(`featured_homes.homestays.featured_home_${home}.price`)}</h6>
                </div>
              </Col>
            )
          })}
        </Row>
      </div>
    )
  }
}

FeaturedHomes.propTypes = {
  t: PropTypes.func,
}
