// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Button, Col, Row } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { deleteUser } from 'redux/modules/privateData/users/deleteUser'
import { requestResetPassword } from 'redux/modules/reset-password'

// Relative imports
import styles from './ManageSecurity.styles'

@connect(state => ({
  jwt: state.auth.token,
  user: state.privateData.user.data,
}))
@translate()
export default class ManageSecurity extends Component {

  render() {

    const {
      user,
      jwt,
      t,
      dispatch,
    } = this.props

    return (
      <Row>
        <Col xs={12} md={6} lg={3}>
          <Button onClick={() => dispatch(requestResetPassword(user.email))} style={styles.btn} block bsStyle='info'>{t('admin.privacy_change_password')}</Button>
          <Link to='/terms'><Button style={styles.btn} block bsStyle='info'>{t('admin.privacy_terms')}</Button></Link>
          <Button onClick={() => dispatch(deleteUser(jwt))} style={styles.btn} block bsStyle='danger'>{t('admin.privacy_delete_button')}</Button>
        </Col>
      </Row>
    )
  }
}

ManageSecurity.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  t: PropTypes.func,
}
