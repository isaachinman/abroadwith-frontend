// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, ControlLabel, FormControl, FormGroup, Row } from 'react-bootstrap'
import { translate } from 'react-i18next'

@translate()
export default class ContactInfo extends Component {

  state = {
    validatedFields: {
      birthDate: {
        uiState: null,
      },
      firstName: {
        uiState: null,
      },
      lastName: {
        uiState: null,
      },
    },
  }

  render() {

    const {
      t,
      user,
    } = this.props

    console.log(user)
    console.log(this)

    const {
      firstName,
    } = this.state.validatedFields

    return (
      <Row>
        <Col xs={12} sm={6} md={4}>
          <FormGroup validationState={firstName.uiState}>
            <ControlLabel>{t('common.First_name')}</ControlLabel>
            <FormControl
              type='text'
              label={t('common.First_name')}
              defaultValue={user.firstName}
              placeholder={t('common.First_name')}
              onChange={event => this.handleNameChange(event, 'first')}
            />
            <FormControl.Feedback />
          </FormGroup>
        </Col>
      </Row>
    )
  }
}

ContactInfo.propTypes = {
  user: PropTypes.object,
  t: PropTypes.func,
}
