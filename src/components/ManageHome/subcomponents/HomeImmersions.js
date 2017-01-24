// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Button, Col, Collapse, ControlLabel, FormControl, InputGroup, Modal, Tooltip, OverlayTrigger, Row, Panel } from 'react-bootstrap'
import UploadTeacherCertifications from 'components/UploadTeacherCertifications/UploadTeacherCertifications'
import { SimpleSelect as Select, MultiSelect } from 'react-selectize'
import Currencies from 'data/constants/Currencies'
import FontAwesome from 'react-fontawesome'
import Slider from 'rc-slider'
import validator from 'validator'

// Styles
const styles = {
  descriptionParagraph: {
    minHeight: 100,
  },
}

const hoursSharedPerWeekOptions = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]

@translate()
export default class HomeImmersions extends Component {

  state = {
    certificationModalOpen: false,
    immersionsEnabled: {
      stay: this.props.home.data.immersions.stay && this.props.home.data.immersions.stay.isActive,
      tandem: this.props.home.data.immersions.tandem && this.props.home.data.immersions.tandem.isActive,
      teacher: this.props.home.data.immersions.teacher && this.props.home.data.immersions.teacher.isActive,
    },
    immersions: {
      stay: this.props.home.data.immersions.stay || {},
      tandem: this.props.home.data.immersions.tandem || {},
      teacher: this.props.home.data.immersions.teacher || {},
    },
  }

  handleValueChange = (immersionType, field, value) => {
    const { immersions } = this.state
    immersions[immersionType][field] = value
    this.setState({ immersions })
  }

  toggleImmersion = immersion => {
    const { immersions } = this.state
    immersions[immersion].isActive = !immersions[immersion].isActive
    this.setState({ immersions })
  }

  closeCertificationModal = () => this.setState({ certificationModalOpen: false })
  openCertificationModal = () => this.setState({ certificationModalOpen: true })

  stayImmersionIsValid = () => {

    const { stay } = this.state.immersions
    const { home } = this.props
    let stayValidFields = 0

    // Validate stay isActive
    if (typeof stay.isActive === 'boolean') {
      stayValidFields++
    }

    // Validate stay hours
    if (stay.hours === parseInt(stay.hours) && stay.hours >= 7 && stay.hours <= 21) {
      stayValidFields++
    }

    // Validate stay languages
    if (stay.languagesOffered &&
        stay.languagesOffered.constructor === Array &&
        stay.languagesOffered.length > 0 &&
        !stay.languagesOffered.some(lang => home.data.stayAvailableLanguages.indexOf(lang) === -1)) {
      stayValidFields++
    }

    return stayValidFields === 3

  }

  tandemImmersionIsValid = () => {

    const { tandem } = this.state.immersions
    const { home } = this.props
    let tandemValidFields = 0

    // Validate tandem isActive
    if (typeof tandem.isActive === 'boolean') {
      tandemValidFields++
    }

    // Validate tandem hours
    if (tandem.hours === parseInt(tandem.hours) && tandem.hours >= 7 && tandem.hours <= 21) {
      tandemValidFields++
    }

    // Validate tandem offered languages
    if (tandem.languagesOffered &&
        tandem.languagesOffered.constructor === Array &&
        tandem.languagesOffered.length > 0 &&
        !tandem.languagesOffered.some(lang => home.data.tandemAvailableLanguages.indexOf(lang) === -1)) {
      tandemValidFields++
    }

    // Validate tandem sought languages
    if (tandem.languagesInterested &&
        tandem.languagesInterested.constructor === Array &&
        tandem.languagesInterested.length > 0) {
      tandemValidFields++
    }

    return tandemValidFields === 4

  }

  teacherImmersionIsValid = () => {

    const { teacher } = this.state.immersions
    const { home } = this.props
    let teacherValidFields = 0

    // Validate teacher isActive
    if (typeof teacher.isActive === 'boolean') {
      teacherValidFields++
    }

    // Validate teacher offered languages
    if (teacher.languagesOffered &&
        teacher.languagesOffered.constructor === Array &&
        teacher.languagesOffered.length > 0 &&
        !teacher.languagesOffered.some(lang => home.data.teacherAvailableLanguages.indexOf(lang) === -1)) {
      teacherValidFields++
    }

    // Validate teacher packages
    if (teacher.packages &&
        teacher.packages.constructor === Array &&
        teacher.packages.length > 0 &&
        !teacher.packages.some(lang => [5, 10, 15].indexOf(lang) === -1)) {
      teacherValidFields++
    }

    // Validate teacher hourly rate
    if (teacher.hourly === parseInt(teacher.hourly)) {
      teacherValidFields++
    }

    return teacherValidFields === 4

  }

  distributeTandemDiscount = (inputObject, cb) => {

    // Only proceed if there is indeed a global discount to apply
    if (inputObject.discount) {
      const discount = inputObject.discount
      const tandem = Object.assign({}, inputObject, {
        languagesInterested: inputObject.languagesInterested.map(lang => {
          if (typeof lang === 'object') {
            return {
              lang: lang.lang,
              discount,
            }
          } else if (typeof lang === 'string') {
            return {
              lang,
              discount,
            }
          }
        }),
      })
      delete tandem.discount
      const { immersions } = this.state
      immersions.tandem = tandem
      this.setState({ immersions }, cb)
    } else {
      cb()
    }

  }

  updateImmersions = () => {
    const { updateHome, home } = this.props
    const { immersions } = this.state
    this.distributeTandemDiscount(immersions.tandem, () => {
      const validatedImmersions = {
        stay: this.stayImmersionIsValid() ? this.state.immersions.stay : null,
        tandem: this.tandemImmersionIsValid() ? this.state.immersions.tandem : null,
        teacher: this.teacherImmersionIsValid() ? this.state.immersions.teacher : null,
      }
      updateHome(Object.assign({}, home.data, {
        immersions: validatedImmersions,
      }))
    })

  }

  render() {

    const { certificationModalOpen, immersions } = this.state
    const { home, inProgress, t } = this.props

    const loading = home.loading

    const stayIsValid = this.stayImmersionIsValid()
    const tandemIsValid = this.tandemImmersionIsValid()
    const teacherIsValid = this.teacherImmersionIsValid()

    const formIsValid = stayIsValid || tandemIsValid || teacherIsValid

    let tandemDiscount = 0
    if (immersions.tandem.discount) {
      tandemDiscount = immersions.tandem.discount
    } else if (immersions.tandem.languagesInterested && immersions.tandem.languagesInterested.length > 0 && immersions.tandem.languagesInterested[0].discount) {
      tandemDiscount = immersions.tandem.languagesInterested[0].discount
    }

    return (

      <span>
        <Row>
          <Col xs={12} lg={4}>
            <Collapse in={immersions.stay.isActive}>
              <div>
                <Panel
                  header={<h3>{t('common.Stay')}</h3>}
                  footer={<a onClick={() => this.toggleImmersion('stay')}>{t('manage_home.disable')}</a>}
                >
                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('immersions.hours_per_week_label')}*</ControlLabel>
                      <OverlayTrigger placement='right' overlay={<Tooltip id='tooltip'>{t('manage_home.stay_hours_tooltip')}</Tooltip>}>
                        <FontAwesome name='question-circle' className='pull-right text-muted' />
                      </OverlayTrigger>
                      <Select
                        theme='bootstrap3'
                        onValueChange={event => this.handleValueChange('stay', 'hours', event ? event.value : '')}
                        value={immersions.stay.hours ? { label: immersions.stay.hours, value: immersions.stay.hours } : null}
                        placeholder={t('immersions.hours_per_week_placeholder')}
                      >
                        {hoursSharedPerWeekOptions.map(num => <option value={num} key={`stayhr${num}`}>{num.toString()}</option>)}
                      </Select>
                    </Col>

                  </Row>
                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('immersions.languages_offered_label')}*</ControlLabel>
                      <MultiSelect
                        theme='bootstrap3'
                        onValuesChange={event => this.handleValueChange('stay', 'languagesOffered', event.map(option => option.value))}
                        placeholder={t('immersions.languages_offered_placeholder')}
                        options={home.data.stayAvailableLanguages.map(language => {
                          return { label: t(`languages.${language}`), value: language }
                        })}
                        values={immersions.stay.languagesOffered ? immersions.stay.languagesOffered.map(language => {
                          return { label: t(`languages.${language}`), value: language }
                        }) : []}
                      />
                    </Col>
                  </Row>
                </Panel>
              </div>
            </Collapse>
            <Collapse in={!immersions.stay.isActive}>
              <div>
                <Panel footer={<Button bsStyle='primary' onClick={() => this.toggleImmersion('stay')}>{t('manage_home.enable')}</Button>}>
                  <h3>{t('common.Stay')}</h3>
                  <p style={styles.descriptionParagraph}>{t('manage_home.stay_description')}</p>
                </Panel>
              </div>
            </Collapse>
          </Col>

          <Col xs={12} lg={4}>
            <Collapse in={immersions.tandem.isActive}>
              <div>
                <Panel
                  header={<h3>{t('common.Tandem')}</h3>}
                  footer={<a onClick={() => this.toggleImmersion('tandem')}>{t('manage_home.disable')}</a>}
                >
                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('immersions.hours_per_week_label')}*</ControlLabel>
                      <OverlayTrigger placement='right' overlay={<Tooltip id='tooltip'>{t('manage_home.tandem_hours_tooltip')}</Tooltip>}>
                        <FontAwesome name='question-circle' className='pull-right text-muted' />
                      </OverlayTrigger>
                      <Select
                        theme='bootstrap3'
                        onValueChange={event => this.handleValueChange('tandem', 'hours', event ? event.value : '')}
                        value={immersions.tandem.hours ? { label: immersions.tandem.hours, value: immersions.tandem.hours } : null}
                        placeholder={t('immersions.hours_per_week_placeholder')}
                      >
                        {hoursSharedPerWeekOptions.map(num => <option value={num} key={`tandemhr${num}`}>{num.toString()}</option>)}
                      </Select>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('immersions.languages_offered_label')}*</ControlLabel>
                      <MultiSelect
                        theme='bootstrap3'
                        onValuesChange={event => this.handleValueChange('tandem', 'languagesOffered', event.map(option => option.value))}
                        placeholder={t('immersions.languages_offered_placeholder')}
                        options={home.data.tandemAvailableLanguages.map(language => {
                          return { label: t(`languages.${language}`), value: language }
                        })}
                        values={immersions.tandem.languagesOffered ? immersions.tandem.languagesOffered.map(language => {
                          return { label: t(`languages.${language}`), value: language }
                        }) : []}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('immersions.languages_interested_label')}*</ControlLabel>
                      <MultiSelect
                        theme='bootstrap3'
                        onValuesChange={event => this.handleValueChange('tandem', 'languagesInterested', event.map(option => option.value))}
                        placeholder={t('immersions.languages_interested_placeholder')}
                        options={home.data.tandemAvailableLearnLanguages.map(language => {
                          return { label: t(`languages.${language}`), value: language }
                        })}
                        values={immersions.tandem.languagesInterested ? immersions.tandem.languagesInterested.map(language => {
                          if (typeof language === 'object') {
                            return { label: t(`languages.${language.lang}`), value: language.lang }
                          }
                          return { label: t(`languages.${language}`), value: language }
                        }) : []}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('manage_home.pricing_discount_tandem')}*</ControlLabel>

                      <Slider
                        onChange={event => this.handleValueChange('tandem', 'discount', event)}
                        min={0}
                        max={100}
                        tipFormatter={value => `${value}%`}
                        value={tandemDiscount}
                      />

                    </Col>
                  </Row>
                </Panel>
              </div>
            </Collapse>
            <Collapse in={!immersions.tandem.isActive}>
              <div>
                <Panel footer={<Button bsStyle='primary' onClick={() => this.toggleImmersion('tandem')}>{t('manage_home.enable')}</Button>} >
                  <h3>{t('common.Tandem')}</h3>
                  <p style={styles.descriptionParagraph}>{t('manage_home.stay_description')}</p>
                </Panel>
              </div>
            </Collapse>
          </Col>

          <Col xs={12} lg={4}>
            <Collapse in={immersions.teacher.isActive}>
              <div>
                <Panel
                  header={<h3>{t('common.Teachers_stay')}</h3>}
                  footer={<a onClick={() => this.toggleImmersion('teacher')}>{t('manage_home.disable')}</a>}
                >
                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('immersions.languages_offered_label')}*</ControlLabel>
                      <MultiSelect
                        theme='bootstrap3'
                        onValuesChange={event => this.handleValueChange('teacher', 'languagesOffered', event.map(option => option.value))}
                        placeholder={t('immersions.languages_offered_placeholder')}
                        options={home.data.teacherAvailableLanguages.map(language => {
                          return { label: t(`languages.${language}`), value: language }
                        })}
                        values={immersions.teacher.languagesOffered ? immersions.teacher.languagesOffered.map(language => {
                          return { label: t(`languages.${language}`), value: language }
                        }) : []}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('immersions.packages_offered_label')}*</ControlLabel>
                      <OverlayTrigger placement='right' overlay={<Tooltip id='tooltip'>{t('manage_home.teacher_packages_tooltip')}</Tooltip>}>
                        <FontAwesome name='question-circle' className='pull-right text-muted' />
                      </OverlayTrigger>
                      <MultiSelect
                        theme='bootstrap3'
                        onValuesChange={event => this.handleValueChange('teacher', 'packages', event.map(option => option.value))}
                        placeholder={t('immersions.packages_offered_placeholder')}
                        options={[
                          { value: 5, label: `5 ${t('immersions.hours_per_week_short')}` },
                          { value: 10, label: `10 ${t('immersions.hours_per_week_short')}` },
                          { value: 15, label: `15 ${t('immersions.hours_per_week_short')}` },
                        ]}
                        values={immersions.teacher.packages ? immersions.teacher.packages.map(item => {
                          return { label: `${item} ${t('immersions.hours_per_week_short')}`, value: item }
                        }) : []}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('immersions.hourly_rate_label')}*</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>{Currencies[home.data.pricing.currency]}</InputGroup.Addon>
                        <FormControl
                          type='text'
                          value={immersions.teacher.hourly || ''}
                          placeholder='20'
                          onChange={event => {
                            const value = event.target.value
                            if (validator.isInt(value) || value === '') {
                              this.handleValueChange('teacher', 'hourly', parseInt(value))
                            }
                          }}
                        />
                        <InputGroup.Addon>.00</InputGroup.Addon>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <Button onClick={this.openCertificationModal} bsStyle='primary' bsSize='xsmall'>{t('manage_home.add_a_certificate')}</Button>
                    </Col>
                  </Row>
                </Panel>
              </div>
            </Collapse>
            <Collapse in={!immersions.teacher.isActive}>
              <div>
                <Panel footer={<Button bsStyle='primary' onClick={() => this.toggleImmersion('teacher')}>{t('manage_home.enable')}</Button>}>
                  <h3>{t('common.Teachers_stay')}</h3>
                  <p style={styles.descriptionParagraph}>{t('manage_home.stay_description')}</p>
                </Panel>
              </div>
            </Collapse>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <p dangerouslySetInnerHTML={{ __html: t('manage_home.immersions_explanation') }} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Button onClick={this.updateImmersions} disabled={!formIsValid || loading} bsStyle='primary'>
              {loading && <span>{t('common.Loading')}</span>}
              {!loading && (inProgress ? <span>{t('manage_home.next_button')}</span> : <span>{t('manage_home.save_button')}</span>)}
            </Button>
          </Col>
        </Row>
        <Modal
          bsSize='small'
          show={certificationModalOpen}
          onHide={this.closeCertificationModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t('manage_home.certificate_modal_title')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UploadTeacherCertifications />
          </Modal.Body>
        </Modal>
      </span>

    )
  }
}

HomeImmersions.propTypes = {
  dispatch: PropTypes.func,
  home: PropTypes.object,
  inProgress: PropTypes.bool,
  t: PropTypes.func,
  updateHome: PropTypes.func,
  token: PropTypes.string,
}
