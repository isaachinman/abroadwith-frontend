// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Grid, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { scrollToTopOfPage } from 'utils/scrolling'
import { StaticHero } from 'components'

// Relative imports
import CityPanel from './subcomponents/CityPanel'
import styles from './PopularLanguages.styles'

// Cities by language
const englishCities = ['London', 'Bournemouth', 'Brighton', 'Bristol', 'Cambridge', 'Eastbourne', 'Manchester', 'Oxford', 'Vancouver', 'New York', 'San Francisco', 'Seattle']
const spanishCities = ['Barcelona', 'Granada', 'Madrid', 'Salamanca', 'Sevilla', 'Valencia', 'Alicante', 'Buenos Aires']
const germanCities = ['Berlin', 'Hamburg', 'Munich', 'Heidelberg', 'Vienna']

@translate()
export default class PopularLanguages extends Component {

  componentDidMount = () => scrollToTopOfPage()

  render() {
    const { t } = this.props
    return (
      <div>
        <Helmet
          title={t('popular_languages.title')}
          meta={[
            { name: 'description', content: t('meta_description.meta_description') },
          ]}
        />
        <StaticHero
          title={t('popular_languages.h1')}
          subtitle={t('popular_languages.introduction_paragraph_1')}
          image='/app/hero/hero_v2_popular_languages.jpeg'
        />
        <Grid style={styles.grid}>
          <div style={styles.contentContainer}>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <p>{t('popular_languages.introduction_paragraph_2')}</p>
                <p>{t('popular_languages.introduction_paragraph_3')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h4>{t('languages.ENG')}</h4>
                <p>{t('popular_languages.language_text.ENG')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                {englishCities.map(city => <CityPanel cityName={city} key={city} />)}
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h4>{t('languages.SPA')}</h4>
                <p>{t('popular_languages.language_text.SPA')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                {spanishCities.map(city => <CityPanel cityName={city} key={city} />)}
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h4>{t('languages.DEU')}</h4>
                <p>{t('popular_languages.language_text.DEU')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                {germanCities.map(city => <CityPanel cityName={city} key={city} />)}
              </Col>
            </Row>
          </div>
        </Grid>
      </div>
    )
  }
}

PopularLanguages.propTypes = {
  t: PropTypes.func,
}
