// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Col, Row } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

@translate()
export default class EmailVerified extends Component {

  render() {
    const { jwt, t } = this.props
    return (
      <span>
        <Row>
          <Col xs={12}>
            <h4>{t('common.email_verification_succeeded')} <small><FontAwesome name='check' /></small></h4>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <p dangerouslySetInnerHTML={{
              __html: t('common.email_verified_success_paragraph1', { profile_link_open: `<a href='/user/${jwt.rid}'>`, profile_link_close: '</a>', host_link_open: '<a href="/host-international-students">', host_link_close: '</a>' }),
            }}
            />
          </Col>
        </Row>
      </span>
    )
  }
}

EmailVerified.propTypes = {
  jwt: PropTypes.object,
  t: PropTypes.func,
}
