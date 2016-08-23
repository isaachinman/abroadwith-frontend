import { Col, Grid, Row } from 'react-bootstrap'
import React from 'react'
import styles from './Footer.styles'

export default function Footer() {

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

Footer.propTypes = {}
