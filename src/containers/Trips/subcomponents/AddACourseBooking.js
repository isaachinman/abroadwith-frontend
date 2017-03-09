// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button, Col, Panel, Row } from 'react-bootstrap'
import { Link } from 'react-router'
import { translate } from 'react-i18next'

// Styles
const styles = {
  panel: {
    margin: '60px 0',
    textAlign: 'center',
    boxShadow: 'none',
    paddingBottom: 15,
  },
  paragraph: {
    textAlign: 'left',
    maxWidth: 360,
    margin: '0 auto 40px auto',
  },
}

@connect()
@translate()
export default class CourseBooking extends Component {

  render() {

    const { t } = this.props

    return (
      <Row>
        <Col xs={12}>
          <Panel style={styles.panel}>
            <h4 className='header-green'>{t('trips.add_a_course_title')}</h4>
            <p style={styles.paragraph}>{t('trips.add_a_course_description')}</p>
            <Link to='/language-courses/search'>
              <Button bsStyle='primary' bsSize='xsmall'>{t('booking.add_course')}</Button>
            </Link>
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
