// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, Grid, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { createHomestay } from 'redux/modules/privateData/homes/homeManagement'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import { openHostSignupModal } from 'redux/modules/ui/modals'
import { scrollToTopOfPage } from 'utils/scrolling'
import { StaticHero, Testimonial } from 'components'
import { push } from 'react-router-redux'

// Relative imports
import styles from './AbroadwithForHosts.styles'

@connect(state => ({
  jwt: state && state.auth ? state.auth.jwt : null,
  token: state.auth.token,
  user: state.privateData.user,
}))
@translate()
export default class AbroadwithForHosts extends Component {

  componentDidMount = () => scrollToTopOfPage()

  handleBecomeAHostClick = () => {
    const { dispatch, jwt, token, user } = this.props
    if (jwt && user.data) {

      if (user.data.homeIds.length === 0) {
        dispatch(createHomestay(token, user.data, true))
      } else {
        dispatch(push('/manage-home'))
      }

    } else {
      dispatch(openHostSignupModal())
    }
  }

  render() {
    const { t } = this.props
    return (
      <div>
        <Helmet
          title={t('host.title')}
          meta={[
            { name: 'description', content: t('host.meta_description') },
          ]}
        />
        <StaticHero
          title={t('host.h1')}
          subtitle={t('host.subtitle')}
          actionButton={<Button onClick={this.handleBecomeAHostClick} bsSize='small' bsStyle='primary'>{t('common.navbar_become_host')}</Button>}
          image='/app/hero/hero_v2_abroadwith_for_hosts.jpg'
        />
        <Grid style={styles.grid}>
          <div style={styles.contentContainer}>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h5>{t('host.why_become')}</h5>
                <p>{t('host.why_become_paragraph1')}</p>
                <p>{t('host.why_become_paragraph2')}</p>
                <ul>
                  <li dangerouslySetInnerHTML={{ __html: t('host.why_become_bullet1') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('host.why_become_bullet2') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('host.why_become_bullet3') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('host.why_become_bullet4') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('host.why_become_bullet5') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('host.why_become_bullet6') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('host.why_become_bullet7') }} />
                </ul>
                <div style={styles.btnContainer}>
                  <Button onClick={this.handleBecomeAHostClick} bsSize='small' bsStyle='primary'>{t('common.navbar_become_host')}</Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h4>{t('host.immersions')}</h4>
                <p>{t('host.immersions_paragraph')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h6>{t('immersions.stay')}</h6>
                <p>{t('host.stay_description')}</p>
                <p>{t('host.stay_paragraph')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h6>{t('immersions.tandem')}</h6>
                <p>{t('host.tandem_description')}</p>
                <p>{t('host.tandem_paragraph1')}</p>
                <p>{t('host.tandem_paragraph2')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h6>{t('immersions.teacher')}</h6>
                <p>{t('host.teacher_description')}</p>
                <p>{t('host.teacher_paragraph1')}</p>
                <p>{t('host.teacher_paragraph2')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h4 style={{ marginBottom: 30 }}>{t('testimonials.title')}</h4>
                <Testimonial
                  type='host'
                  person='esther'
                />
                <Testimonial
                  type='host'
                  person='cathy'
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

AbroadwithForHosts.propTypes = {
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  user: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
