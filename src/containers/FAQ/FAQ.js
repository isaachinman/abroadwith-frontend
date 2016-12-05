/* eslint-disable */
import React, { Component, PropTypes } from 'react'
import { Grid, Row, Tab, Tabs } from 'react-bootstrap'
import { translate } from 'react-i18next'

// Relative imports
import styles from './FAQ.styles.js'

@translate()
export default class Help extends Component {
  render() {
    const { t } = this.props
    return (
      <Grid>
        FAQ
      </Grid>
    )
  }
}
