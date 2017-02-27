// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Grid, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { scrollToTopOfPage } from 'utils/scrolling'
import { StaticHero } from 'components'

// Relative imports
// import styles from './AbroadwithForStudents.styles'

@translate()
export default class AbroadwithForStudents extends Component {

  componentDidMount = () => scrollToTopOfPage()

  render() {
    const { t } = this.props
    return (
      <div>
        <Helmet title={t('why_abroadwith.title')} />
        <StaticHero
          title={t('why_abroadwith.h1')}
          subtitle={t('why_abroadwith.find_immersion_program')}
          image='/app/hero/hero_testimonials.jpeg'
        />
        <Grid>
          <Row>
            <Col xs={12}>
              AbroadwithForStudents
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

AbroadwithForStudents.propTypes = {
  t: PropTypes.func,
}
