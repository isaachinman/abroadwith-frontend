// Absolute imports
import { Button, Col, Grid, Row, Panel, FormControl } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import React, { Component } from 'react'
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

      <div style={styles.loginPage}>
        <Helmet title={t('invite.title')} />
        <h1 style={styles.h1}>{t('invite.title')}</h1>
        <Grid>
          <Row>
            <Col xs={12} sm={8} smOffset={2} md={6} mdOffset={3}>
              <Panel>
                <FormControl
                  readOnly
                  type='text'
                  value={`https://abroadwith.com/signup?referral_user=${jwt.rid}`}
                />
                <Button onClick={this.openFacebookShareWindow}>{t('invite.share_on_facebook_btn')}</Button>
              </Panel>
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
