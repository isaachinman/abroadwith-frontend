// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, Panel, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { scrollToTopOfPage } from 'utils/scrolling'
import { translate } from 'react-i18next'

@translate()
export default class CourseBooking extends Component {

  componentDidMount = () => scrollToTopOfPage()

  render() {

    const { t } = this.props

    return (
      <Row>
        <Helmet title={t('common.courses_page_coming_soon_title')} />
        <Col xs={12} md={6} mdOffset={3} lg={4} lgOffset={4} style={{ marginTop: 100 }}>
          <Panel>
            <h1>{t('common.courses_page_coming_soon_title')}</h1>
            <p>{t('common.courses_page_coming_soon_description')}</p>
          </Panel>
        </Col>
      </Row>
    )
  }
}

CourseBooking.propTypes = {
  t: PropTypes.func,
}
