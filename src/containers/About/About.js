// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Grid, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import { scrollToTopOfPage } from 'utils/scrolling'
import { StaticHero } from 'components'

// Relative imports
import styles from './About.styles'

@translate()
export default class About extends Component {

  componentDidMount = () => scrollToTopOfPage()

  render() {
    const { t } = this.props
    return (
      <div>
        <Helmet
          title={t('about.title')}
          meta={[
            { name: 'description', content: t('about.meta_description') },
          ]}
        />
        <StaticHero
          title={t('about.h1')}
          subtitle={t('about.h2')}
          image='/app/hero/hero_v2_about.jpg'
        />
        <Grid style={styles.grid}>
          <div style={styles.contentContainer}>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <p>{t('about.paragraph_1')}</p>
                <p>{t('about.paragraph_2')}</p>
                <p>{t('about.paragraph_3')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h4>{t('common.most_popular_immersions')}</h4>
                <p>{t('about.we_offer_immersions')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h6>{t('immersions.stay')}</h6>
                <p>{t('about.stay_description')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h6>{t('immersions.tandem')}</h6>
                <p>{t('about.tandem_description')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h6>{t('immersions.teacher')}</h6>
                <p>{t('about.teacher_description')}</p>
              </Col>
            </Row>
            <Row style={{ marginTop: 60 }}>
              <Col xs={12} md={8} mdOffset={2}>
                <p className='lead'>
                  {t('about.find_more')} <Link to='/host-international-students'>{t('about.become_host')}</Link> {t('common.words.or')} <Link to='/abroadwith-for-students'>{t('about.learn_language')}</Link>
                </p>
              </Col>
            </Row>
          </div>
        </Grid>
      </div>
    )
  }
}

About.propTypes = {
  t: PropTypes.func,
}
