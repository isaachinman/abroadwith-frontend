import React, { Component } from 'react'
import { Col, Grid, Row } from 'react-bootstrap'
import styles from './Footer.styles'

export default class Footer extends Component {

  render() {

    return (
      <footer style={styles.footer}>
        <Grid style={styles.mainContent}>
          <Row>
            <Col xs={12}>
              Footer stuff
            </Col>
          </Row>
        </Grid>
        <div style={styles.bottomRow}>
          <Grid>
            Bottom row
          </Grid>
        </div>
      </footer>
    )
  }
}

Footer.propTypes = {}
