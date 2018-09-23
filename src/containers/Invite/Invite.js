// Absolute imports
import { Button, Col, Grid, Row, Panel, FormControl } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { StaticHero } from 'components'
import { translate } from 'react-i18next'

// Relative imports
import styles from './Invite.styles.js'

@connect(state => ({
  jwt: state.auth.jwt,
}))
@translate()
export default class Invite extends Component {

  openFacebookShareWindow = () => {
    window.open(
      `https://www.facebook.com/dialog/share?app_id=144948059203060&display=popup&href=https://www.abroadwith.com/signup?referral_user=${this.props.jwt.rid}`,
      'Facebook',
      'width=500,height=500'
    )
  }

  render() {
    const { jwt, t } = this.props
    return (

      <div>
        <Helmet title={t('invite.title')} />
        <StaticHero
          title={t('invite.title')}
          subtitle={t('invite.subtitle') + '*'}
          image='/app/hero/hero_invite.jpeg'
        />
        <Grid>
          <Row style={styles.topRow}>
            <Col xs={12} sm={8} smOffset={2} md={6} mdOffset={3}>
              <Panel>
                <Row>
                  <Col xs={12}>
                    <p>{t('invite.explanation')}</p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <FormControl
                      readOnly
                      type='text'
                      value={`https://abroadwith.com/signup?referral_user=${jwt.rid}`}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <h6 className='text-muted'>{t('common.words.or')}</h6>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Button onClick={this.openFacebookShareWindow} bsStyle='primary'>{t('invite.share_on_facebook_btn')}</Button>
                  </Col>
                </Row>
              </Panel>
            </Col>
            <Col xs={12}>
              <small className='text-muted'>*{t('invite.disclaimer')}</small>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

Invite.propTypes = {
  jwt: React.PropTypes.object,
  t: React.PropTypes.func,
}
