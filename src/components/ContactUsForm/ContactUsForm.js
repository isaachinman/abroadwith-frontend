// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Alert, Button, Col, FormControl, FormGroup, Row, Panel } from 'react-bootstrap'
import { connect } from 'react-redux'
import { contactUsRequest } from 'redux/modules/publicData/users/contactUs'
import { translate } from 'react-i18next'

@connect(state => ({
  contactUs: state.contactUs,
  loggedIn: state.auth.loaded,
  user: state.privateData.user,
}))
@translate()
export default class ContactUsForm extends Component {

  state = {
    firstName: null,
    lastName: null,
    email: null,
    message: null,
  }

  componentWillMount = () => {
    const { loggedIn, user } = this.props
    if (loggedIn && user.data && user.data.firstName) {
      this.setState({
        firstName: user.data.firstName,
        lastName: user.data.lastName,
        email: user.data.email,
      })
    }
  }

  handleChange = (field, value) => {
    const newState = Object.assign({}, this.state)
    newState[field] = value
    this.setState(newState)
  }

  handleSubmit = () => {
    const { dispatch, loggedIn } = this.props
    dispatch(contactUsRequest(Object.assign({}, this.state, {
      newContact: loggedIn === false,
    })))
  }

  validateForm = () => {
    return !(Object.values(this.state).some(value => !value))
  }

  render() {

    const { firstName, lastName, email, message } = this.state
    const { contactUs, loggedIn, t } = this.props

    const formIsValid = this.validateForm()
    console.log(formIsValid)
    console.log(this)

    return (
      <div>
        <Panel
          header={<h3>{t('contact.title')}</h3>}
          footer={!contactUs.loaded && <Button onClick={this.handleSubmit} disabled={!formIsValid || contactUs.loading} bsStyle='primary'>{contactUs.loading ? <span>{t('common.Loading')}</span> : <span>{t('common.send_message')}</span>}</Button>}
        >
          {!contactUs.loaded &&
            <span>
              <Row>
                {!loggedIn &&
                  <span>
                    <Col xs={12}>
                      <FormGroup>
                        <FormControl
                          onChange={event => this.handleChange('firstName', event.target.value)}
                          type='text'
                          placeholder={t('common.First_name')}
                          value={firstName || ''}
                        />
                      </FormGroup>
                    </Col>
                    <Col xs={12}>
                      <FormGroup>
                        <FormControl
                          onChange={event => this.handleChange('lastName', event.target.value)}
                          type='text'
                          placeholder={t('common.Last_name')}
                          value={lastName || ''}
                        />
                      </FormGroup>
                    </Col>
                    <Col xs={12}>
                      <FormGroup>
                        <FormControl
                          onChange={event => this.handleChange('email', event.target.value)}
                          type='email'
                          placeholder={t('common.Email')}
                          value={email || ''}
                        />
                      </FormGroup>
                    </Col>
                  </span>
                }
                <Col xs={12}>
                  <FormGroup>
                    <FormControl
                      onChange={event => this.handleChange('message', event.target.value)}
                      componentClass='textarea'
                      placeholder='Message'
                      style={{ minHeight: 160 }}
                      value={message || ''}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </span>
          }
          {contactUs.loaded &&
            <Alert bsStyle='success'>
              <h4>{t('common.help_request_sent_title')}</h4>
              <p>{t('common.help_request_sent_explanation')}</p>
            </Alert>
          }
        </Panel>
      </div>
    )
  }
}

ContactUsForm.propTypes = {
  contactUs: PropTypes.object,
  dispatch: PropTypes.func,
  loggedIn: PropTypes.bool,
  user: PropTypes.object,
  t: PropTypes.func,
}
