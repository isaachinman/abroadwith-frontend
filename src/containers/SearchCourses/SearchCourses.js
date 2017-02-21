// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Col, Panel, Row } from 'react-bootstrap'
import { scrollToTopOfPage } from 'utils/scrolling'

@connect()
export default class CourseBooking extends Component {

  componentDidMount = () => scrollToTopOfPage()

  render() {

    return (
      <Row>
        <Col xs={12} md={6} mdOffset={3} lg={4} lgOffset={4} style={{ marginTop: 100 }}>
          <Panel>
            <h1>Coming soon!</h1>
            <p>In the very near future, Abroadwith will offer students the ability to book language courses in addition to, and completely separately from, their homestay experiences. This page will host an independent language-course search. Please check back soon.</p>
          </Panel>
        </Col>
      </Row>
    )
  }
}

CourseBooking.propTypes = {
  dispatch: PropTypes.func,
  t: PropTypes.func,
}
