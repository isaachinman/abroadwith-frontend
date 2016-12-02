/* eslint-disable */
import React, { Component, PropTypes } from 'react'
import { Grid, Row } from 'react-bootstrap'

export default class TermsAndConditions extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <h1>Terms And Conditions</h1>
          {/* To Do: lazy load the content.html into this component only on mount to avoid adding unnecessary size to main bundle */}
        </Row>
      </Grid>
    )
  }
}
