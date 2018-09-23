// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col, ControlLabel, FormControl, FormGroup, Row } from 'react-bootstrap'
import { translate } from 'react-i18next'
import CharacterCounter from 'components/CharacterCounter/CharacterCounter'
import validator from 'validator'

// Relative imports
import ManagePhoneNumbers from '../ManagePhoneNumbers/ManagePhoneNumbers'

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
      gender: {
        uiState: null,
      },
    },
  }

  handleChange = (event, type, field) => {

    const { user } = this.props

    // Get old state
    const modifiedValidation = this.state.validatedFields

    // Perform general validation for strings
    if (type === 'string') {
      const isValid = validator.isLength(event.target.value, { min: 2 })
      modifiedValidation[field] = { uiState: isValid ? 'success' : 'error', value: isValid ? event.target.value : null }
    }

    // Only proceed to API action if the field is valid
    if (modifiedValidation[field].uiState === 'success') {
      const newUserObject = Object.assign({}, user, { [field]: modifiedValidation[field].value })
      this.props.updateUser(newUserObject)
    }

    this.setState({ validatedFields: modifiedValidation })

  }

  render() {

    const {
      t,
      user,
    } = this.props

    const {
      firstName,
      lastName,
      gender,
    } = this.state.validatedFields

    return (
      <span>
        <Row>
          <Col xs={12} sm={6} md={4}>
            <FormGroup validationState={firstName.uiState}>
              <ControlLabel>{t('common.First_name')}</ControlLabel>
              <CharacterCounter>
                <FormControl
                  type='text'
                  label={t('common.First_name')}
                  defaultValue={user.firstName}
                  placeholder={t('common.First_name')}
                  onChange={event => this.handleChange(event, 'string', 'firstName')}
                  maxLength={50}
                />
              </CharacterCounter>
              <FormControl.Feedback />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <FormGroup validationState={lastName.uiState}>
              <ControlLabel>{t('common.Last_name')}</ControlLabel>
              <CharacterCounter>
                <FormControl
                  type='text'
                  defaultValue={user.lastName}
                  placeholder={t('common.Last_name')}
                  onChange={event => this.handleChange(event, 'string', 'lastName')}
                  maxLength={50}
                />
              </CharacterCounter>
              <FormControl.Feedback />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <FormGroup validationState={gender.uiState}>
              <ControlLabel>{t('users.gender_label')}</ControlLabel>
              <FormControl componentClass='select' onChange={event => this.handleChange(event, 'string', 'gender')} defaultValue={user.gender ? user.gender : ''}>
                <option value='' disabled>{t('users.gender_placeholder')}</option>
                <option value='MALE'>{t('users.genders.MALE')}</option>
                <option value='FEMALE'>{t('users.genders.FEMALE')}</option>
                <option value='OTHER'>{t('users.genders.OTHER')}</option>
              </FormControl>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6} md={4}>
            <FormGroup>
              <ControlLabel>{t('users.email_label')}</ControlLabel>
              <FormControl.Static>
                {user.email}
              </FormControl.Static>
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <FormGroup>
              <ControlLabel>{t('users.phone_number_label')}</ControlLabel>
              <ManagePhoneNumbers
                dismissable
                {...this.props}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <FormGroup>
              <ControlLabel>{t('users.home_address_label')}</ControlLabel>
              <CharacterCounter>
                <FormControl
                  type='text'
                  defaultValue={user.location}
                  placeholder={t('users.home_address_label')}
                  onChange={event => this.handleChange(event, 'string', 'location')}
                  maxLength={50}
                />
              </CharacterCounter>
              <FormControl.Feedback />
            </FormGroup>
          </Col>
        </Row>
      </span>
    )
  }
}

ContactInfo.propTypes = {
  updateUser: PropTypes.func,
  user: PropTypes.object,
  t: PropTypes.func,
}
