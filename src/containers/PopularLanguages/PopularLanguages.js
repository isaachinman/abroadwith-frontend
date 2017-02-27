// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Grid, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { scrollToTopOfPage } from 'utils/scrolling'
import { StaticHero } from 'components'

// Relative imports
// import styles from './PopularLanguages.styles'

@translate()
export default class PopularLanguages extends Component {

  componentDidMount = () => scrollToTopOfPage()

  render() {
    const { t } = this.props
    return (
      <div>
        <Helmet title={t('popular_languages.title')} />
        <StaticHero
          title={t('popular_languages.h1')}
          image='/app/hero/hero_testimonials.jpeg'
        />
        <Grid>
          <Row>
            <Col xs={12}>
              PopularLanguages
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

PopularLanguages.propTypes = {
  t: PropTypes.func,
}
