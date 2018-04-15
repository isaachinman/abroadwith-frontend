// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Grid, Row, Panel } from 'react-bootstrap'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Login } from 'components'
import { push } from 'react-router-redux'
import { translate } from 'react-i18next'

// Relative imports
import styles from './LoginPage.styles'

@connect(state => ({
  jwt: state.auth.jwt,
}))
@translate()
export default class LoginPage extends Component {

  componentWillReceiveProps = nextProps => {

    // Login just happened, redirect to homepage
    const { dispatch, jwt } = this.props
    if (!jwt && nextProps.jwt) {
      dispatch(push('/'))
    }

  }

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
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  t: PropTypes.func,
}
