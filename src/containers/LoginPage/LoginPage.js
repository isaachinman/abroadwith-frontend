// Absolute imports
import { Col, Grid, Row, Panel } from 'react-bootstrap'
import { Login } from 'components'
import Helmet from 'react-helmet'
import React from 'react'

// Relative imports
import styles from './LoginPage.styles'

// --------------------------------------------------------------------------------
// Login Container
// Dumb (stateless)
// --------------------------------------------------------------------------------

export default function LoginPage() {

  return (

    <div style={styles.loginPage}>
      <Helmet title='Login' />
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
