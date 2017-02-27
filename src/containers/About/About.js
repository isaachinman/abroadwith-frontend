// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Grid, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { scrollToTopOfPage } from 'utils/scrolling'
import { StaticHero } from 'components'

// Relative imports
// import styles from './About.styles'

@translate()
export default class About extends Component {

  componentDidMount = () => scrollToTopOfPage()

  render() {
    const { t } = this.props
    return (
      <div>
        <Helmet title={t('about.title')} />
        <StaticHero
          title={t('about.h1')}
          subtitle={t('about.h2')}
          image='/app/hero/hero_testimonials.jpeg'
        />
        <Grid>
          <Row>
            <Col xs={12}>
              About
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

About.propTypes = {
  t: PropTypes.func,
}
