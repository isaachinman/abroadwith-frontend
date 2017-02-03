// Absolute imports
import React, { Component, PropTypes } from 'react'
import { ContactUsForm } from 'components'
import { Col, Grid, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'

// Relative imports
import styles from './ContactUs.styles'

@translate()
export default class ContactUs extends Component {

  render() {
    const { t } = this.props
    return (
      <Grid>
        <Helmet title={t('contact.title')} />
        <Row style={styles.panelRow}>
          <Col xs={12} sm={8} smOffset={2} lg={6} lgOffset={3}>
            <ContactUsForm />
          </Col>
        </Row>
      </Grid>
    )
  }
}

ContactUs.propTypes = {
  t: PropTypes.func,
}
