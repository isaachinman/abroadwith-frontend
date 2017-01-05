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
        <Helmet title={t('common.Sign_up')} />
        <h1 style={styles.h1}>{t('common.Sign_up')}</h1>
        <Grid>
          <Row>
            <Col xs={12} sm={8} smOffset={2}>
              <Panel>
                {/* FacebookLogin has SSR issues so for now, only render on client */}
                {__CLIENT__ && <Signup />}
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
