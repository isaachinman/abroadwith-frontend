// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { deleteUser } from 'redux/modules/privateData/users/deleteUser'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import PopConfirm from 'antd/lib/popconfirm'
import { requestResetPassword } from 'redux/modules/resetPassword'

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

          <PopConfirm onConfirm={() => dispatch(deleteUser(jwt))} placement='top' title={t('common.are_you_sure')} okText={t('common.words.Yes')} cancelText={t('common.words.No')}>
            <Button style={styles.btn} block bsStyle='danger'>{t('admin.privacy_delete_button')}</Button>
          </PopConfirm>
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
