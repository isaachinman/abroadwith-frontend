// Absolute imports
/* eslint-disable */
import React, { Component, PropTypes } from 'react'
import { Button, Col, Form, FormControl, FormGroup, InputGroup, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import { translate } from 'react-i18next'
import { ManageLanguages } from 'components'
// import { validateExists, validatePassword } from 'utils/validation'
import * as authActions from 'redux/modules/auth'

// Relative imports
import styles from './Signup.styles.js'

@connect(state => ({ jwt: state.auth.jwt, loginStatus: state.auth }), authActions)
@translate()
export default class Signup extends Component {

  state = {
    validatedFields: {
      email: {
        uiState: null,
      },
      password: {
        uiState: null,
      },
    },
  }

  render() {

    const {
      jwt,
      loginStatus,
      logout,
      t,
    } = this.props

    const {
      email,
      password,
    } = this.state.validatedFields

    return (
      <div style={styles.signupPanel}>

        {!jwt &&

          <span>

            <Row style={styles.paddedRow}>
              <Col xs={12}>
                <h3>{t('common.language_modal_hello')}</h3>
                <h5>{t('common.language_modal_title')}</h5>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={10} smOffset={1}>
                <ManageLanguages />
              </Col>
            </Row>
          </span>
        }

        {jwt &&
          <div>
            <p>You are currently logged in as {jwt.name}.</p>

            <div>
              <button className='btn btn-danger' onClick={logout}><i className='fa fa-sign-out' />{' '}Log Out</button>
            </div>
          </div>
        }

      </div>
    )
  }
}

Signup.propTypes = {
  compact: PropTypes.bool,
  jwt: PropTypes.object,
  loginStatus: PropTypes.object,
  logout: PropTypes.func,
}
