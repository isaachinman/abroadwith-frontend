import React, { Component } from 'react'
import { Col, Grid, Row, Panel } from 'react-bootstrap'
import { Login } from 'components'
import Helmet from 'react-helmet'
import styles from './LoginPage.styles'

export default class LoginPage extends Component {

  render() {

    return (

      <div style={styles.loginPage}>
        <Helmet title='Login'/>
        <h1 style={styles.h1}>Login</h1>
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
