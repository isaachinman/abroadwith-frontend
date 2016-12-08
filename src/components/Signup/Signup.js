// Absolute imports
import React, { Component, PropTypes } from 'react'
import shortid from 'shortid'
import { Accordion, Button, Col, Collapse, FormGroup, FormControl, Panel, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { ManageLanguages } from 'components'
import i18n from 'i18n/i18n-client'
import * as authActions from 'redux/modules/auth'

// Relative imports
import styles from './Signup.styles.js'

@connect(state => ({ jwt: state.auth.jwt, loginStatus: state.auth }), authActions)
@translate()
export default class Signup extends Component {

  state = {
    page: 1,
    validatedFields: {
      email: {
        uiState: null,
      },
      password: {
        uiState: null,
      },
    },
    learningLanguages: [
      {
        id: shortid.generate(),
        language: null,
        level: null,
      },
    ],
    knownLanguages: [
      {
        id: shortid.generate(),
        language: null,
        level: null,
      },
    ],
  }

  addLanguage = type => {
    this.setState({
      [`${type}Languages`]: this.state[`${type}Languages`].concat({
        id: shortid.generate(),
        language: null,
        level: null,
      }),
    })
  }

  removeLanguage = (type, id) => {
    this.setState({
      [`${type}Languages`]: this.state[`${type}Languages`].filter(lang => {
        return lang.id !== id
      }),
    })
  }

  updateLanguage = (type, id, data) => {

    const newArray = this.state[`${type}Languages`].map(language => {
      if (language.id !== id) {
        return language
      }
      return ({
        id,
        language: data.length > 0 ? data[0].id : null,
        level: data.length > 0 ? language.level : null,
      })
    })
    this.setState({ [`${type}Languages`]: newArray })

  }

  updateLanguageLevel = (type, id, eventKey) => {
    const newArray = this.state[`${type}Languages`].map(language => {
      if (language.id !== id) {
        return language
      }
      return ({
        id,
        language: language.language,
        level: eventKey,
      })
    })
    this.setState({ [`${type}Languages`]: newArray })
  }

  changePage = page => {
    this.setState({ page })
  }

  render() {

    const {
      knownLanguages,
      learningLanguages,
    } = this.state

    console.log(this)

    // Determine available languages
    const usedLanguages = learningLanguages.map(lang => lang.language).concat(knownLanguages.map(lang => lang.language)).filter(lang => lang !== null)
    const allLanguages = Object.entries(i18n.store.data[i18n.language].translation.languages).map(([id, label]) => ({ id, label }))
    const availableLanguages = allLanguages.filter(lang => usedLanguages.indexOf(lang.id) === -1)

    const {
      jwt,
      logout,
      t,
    } = this.props

    console.log(this.state.page === 1)

    return (
      <div style={styles.signupPanel}>

        {!jwt &&

          <span>

            <Collapse in={this.state.page === 1} unmountOnExit>
              <div>
                <Row style={styles.paddedRow}>
                  <Col xs={12}>
                    <h2>{t('common.language_modal_hello')}</h2>
                    <h5>{t('common.language_modal_title')}</h5>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={10} smOffset={1}>
                    <ManageLanguages
                      addLanguage={this.addLanguage}
                      availableLanguages={availableLanguages}
                      knownLanguages={knownLanguages}
                      learningLanguages={learningLanguages}
                      removeLanguage={this.removeLanguage}
                      updateLanguage={this.updateLanguage}
                      updateLanguageLevel={this.updateLanguageLevel}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Button onClick={() => this.changePage(2)}>Next</Button>
                  </Col>
                </Row>
              </div>
            </Collapse>

            <Collapse in={this.state.page === 2} unmountOnExit>
              <div style={styles.signupMenu}>
                <Row>
                  <Col xs={12}>
                    <Accordion style={styles.emailSignupBtn}>
                      <Panel header={t('common.sign_up_email')} eventKey='1'>
                        <form>
                          <FormGroup>
                            <FormControl
                              type='text'
                              style={styles.emailSignupInput}
                              value={this.state.value}
                              placeholder={t('common.First_name')}
                              onChange={this.handleChange}
                            />
                            <FormControl
                              type='text'
                              style={styles.emailSignupInput}
                              value={this.state.value}
                              placeholder={t('common.Last_name')}
                              onChange={this.handleChange}
                            />
                            <FormControl
                              type='email'
                              style={styles.emailSignupInput}
                              value={this.state.value}
                              placeholder={t('common.Email')}
                              onChange={this.handleChange}
                            />
                            <FormControl
                              type='password'
                              style={styles.emailSignupInput}
                              value={this.state.value}
                              placeholder={t('common.Password')}
                              onChange={this.handleChange}
                            />
                            <FormControl
                              type='date'
                              style={styles.emailSignupInput}
                              value={this.state.value}
                              placeholder={t('common.Birthday')}
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                          <Button bsStyle='success'>{t('common.Sign_up')}</Button>
                        </form>
                      </Panel>
                    </Accordion>
                    <Button block>{t('common.sign_up_facebook')}</Button>
                    <Button block>{t('common.sign_up_google')}</Button>
                  </Col>
                </Row>
              </div>
            </Collapse>

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
  t: PropTypes.func,
}
