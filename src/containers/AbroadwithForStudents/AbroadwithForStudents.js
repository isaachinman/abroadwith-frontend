// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, Grid, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import { scrollToTopOfPage } from 'utils/scrolling'
import { StaticHero, Testimonial } from 'components'

// Relative imports
import styles from './AbroadwithForStudents.styles'

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
          subtitle={t('why_abroadwith.subtitle')}
          image='/app/hero/hero_v2_abroadwith_for_students.jpg'
        />
        <Grid style={styles.grid}>
          <div style={styles.contentContainer}>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <p>{t('why_abroadwith.paragraph1')}</p>
                <p>{t('why_abroadwith.paragraph2')}</p>
                <p>{t('why_abroadwith.paragraph3')}</p>
                <p>{t('why_abroadwith.paragraph4')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h4>{t('why_abroadwith.how_we_work')}</h4>
                <ul>
                  <li>{t('why_abroadwith.how_we_work1')}</li>
                  <li>{t('why_abroadwith.how_we_work2')}</li>
                  <li>{t('why_abroadwith.how_we_work3')}</li>
                  <li>{t('why_abroadwith.how_we_work4')}</li>
                  <li>{t('why_abroadwith.how_we_work5')}</li>
                  <li>{t('why_abroadwith.how_we_work6')}</li>
                </ul>
                <div style={styles.btnContainer}>
                  <Link to='/language-homestay/search'>
                    <Button bsSize='xsmall' bsStyle='primary'>{t('why_abroadwith.find_immersion_program')}</Button>
                  </Link>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h4>{t('why_abroadwith.immersions')}</h4>
                <p>{t('why_abroadwith.immersions_paragraph')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h6>{t('immersions.stay')}</h6>
                <p>{t('why_abroadwith.stay_paragraph')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h6>{t('immersions.tandem')}</h6>
                <p>{t('why_abroadwith.tandem_paragraph')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h6>{t('immersions.teacher')}</h6>
                <p>{t('why_abroadwith.teacher_paragraph')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h4 style={{ marginBottom: 30 }}>{t('testimonials.title')}</h4>
                <Testimonial
                  type='student'
                  person='daniel'
                />
                <Testimonial
                  type='student'
                  person='isabel'
                />
                <div style={styles.btnContainer}>
                  <Link to='/testimonials'>
                    <Button bsSize='xsmall' bsStyle='primary'>{t('common.see_more_testimonials')}</Button>
                  </Link>
                </div>
              </Col>
            </Row>
          </div>
        </Grid>
      </div>
    )
  }
}

AbroadwithForStudents.propTypes = {
  t: PropTypes.func,
}
