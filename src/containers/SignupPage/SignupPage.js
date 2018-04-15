// Absolute imports
import { Col, Grid, Row, Panel } from 'react-bootstrap'
import { Signup } from 'components'
import Helmet from 'react-helmet'
import React, { Component } from 'react'
import { translate } from 'react-i18next'

// Relative imports
import styles from './SignupPage.styles'

@translate()
export default class SignupPage extends Component {

  render() {
    const { t } = this.props
    return (
      <div style={styles.loginPage}>
        <Helmet
          title={t('common.Sign_up')}
          meta={[
            { property: 'og:title', content: t('signup.referral_og_title') },
            { property: 'og:description', content: t('signup.referral_og_description') },
            { property: 'og:image', content: 'https://abroadwith.imgix.net/app/hero/hero_host.jpg' },
            { property: 'fb:app_id', content: '144948059203060' },
          ]}
        />
        <h1 style={styles.h1}>{t('common.Sign_up')}</h1>
        <Grid>
          <Row>
            <Col xs={12} sm={8} smOffset={2}>
              <Panel>
                <Signup />
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

SignupPage.propTypes = {
  t: React.PropTypes.func,
}
