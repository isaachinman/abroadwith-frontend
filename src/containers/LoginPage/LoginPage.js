// Absolute imports
import { Col, Grid, Row, Panel } from 'react-bootstrap'
import { Login } from 'components'
import Helmet from 'react-helmet'
import React, { Component } from 'react'
import { translate } from 'react-i18next'

// Relative imports
import styles from './LoginPage.styles'

@translate()
export default class LoginPage extends Component {

  render() {
    const { t } = this.props
    return (

      <div style={styles.loginPage}>
        <Helmet title={t('login.title')} />
        <h1 style={styles.h1}>{t('login.title')}</h1>
        <Grid>
          <Row>
            <Col xs={12} sm={8} smOffset={2} md={6} mdOffset={3}>
              <Panel>
                <Login />
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

LoginPage.propTypes = {
  t: React.PropTypes.func,
}
