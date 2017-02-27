// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Grid, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { scrollToTopOfPage } from 'utils/scrolling'
import { StaticHero } from 'components'

// Relative imports
// import styles from './AbroadwithForHosts.styles'

@translate()
export default class AbroadwithForHosts extends Component {

  componentDidMount = () => scrollToTopOfPage()

  render() {
    const { t } = this.props
    return (
      <div>
        <Helmet title={t('host.meta_description')} />
        <StaticHero
          title={t('host.h1')}
          subtitle={t('host.subtitle')}
          image='/app/hero/hero_testimonials.jpeg'
        />
        <Grid>
          <Row>
            <Col xs={12}>
              AbroadwithForHosts
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

AbroadwithForHosts.propTypes = {
  t: PropTypes.func,
}
