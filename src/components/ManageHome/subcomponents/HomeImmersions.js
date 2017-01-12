// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Button, Col, Collapse, ControlLabel, FormControl, InputGroup, Modal, Row, Panel } from 'react-bootstrap'
import UploadTeacherCertifications from 'components/UploadTeacherCertifications/UploadTeacherCertifications'
import { SimpleSelect as Select, MultiSelect } from 'react-selectize'
import Currencies from 'data/constants/Currencies'
import ReactBootstrapSlider from 'react-bootstrap-slider'
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
    immersions[`${immersionType}`][`${field}`] = value
    this.setState({ immersions })
  }

  toggleImmersion = immersion => {
    this.setState({ immersionsEnabled: Object.assign({}, this.state.immersionsEnabled, { [`${immersion}`]: !this.state.immersionsEnabled[`${immersion}`] }) })
  }

  closeCertificationModal = () => this.setState({ certificationModalOpen: false })
  openCertificationModal = () => this.setState({ certificationModalOpen: true })

  render() {

    const { certificationModalOpen, immersions, immersionsEnabled } = this.state
    const { home, t } = this.props

    console.log(this)

    return (

      <span>
        <Row>
          <Col xs={12} md={4}>
            <Collapse in={immersionsEnabled.stay}>
              <div>
                <Panel
                  header={<h3>{t('common.Stay')}</h3>}
                  footer={<a onClick={() => this.toggleImmersion('stay')}>{t('manage_home.disable')}</a>}
                >
                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('immersions.hours_per_week_label')}*</ControlLabel>
                      <Select
                        theme='bootstrap3'
                        onValueChange={event => this.handleValueChange('stay', 'hours', event.value)}
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
                        options={home.data.stayAvailableLanguages.map(language => {
                          return { label: t(`languages.${language}`), value: language }
                        })}
                      />
                    </Col>
                  </Row>
                </Panel>
              </div>
            </Collapse>
            <Collapse in={!immersionsEnabled.stay}>
              <div>
                <Panel>
                  <h3>{t('common.Stay')}</h3>
                  <p style={styles.descriptionParagraph}>{t('manage_home.stay_description')}</p>
                  <Button bsStyle='primary' onClick={() => this.toggleImmersion('stay')}>{t('manage_home.enable')}</Button>
                </Panel>
              </div>
            </Collapse>
          </Col>

          <Col xs={12} md={4}>
            <Collapse in={immersionsEnabled.tandem}>
              <div>
                <Panel
                  header={<h3>{t('common.Tandem')}</h3>}
                  footer={<a onClick={() => this.toggleImmersion('tandem')}>{t('manage_home.disable')}</a>}
                >
                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('immersions.hours_per_week_label')}*</ControlLabel>
                      <Select
                        theme='bootstrap3'
                        onValueChange={event => this.handleValueChange('tandem', 'hours', event.value)}
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
                        options={home.data.tandemAvailableLanguages.map(language => {
                          return { label: t(`languages.${language}`), value: language }
                        })}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('immersions.languages_interested_label')}*</ControlLabel>
                      <MultiSelect
                        theme='bootstrap3'
                        onValuesChange={event => this.handleValueChange('tandem', 'languagesInterested', event.map(option => option.value))}
                        options={home.data.tandemAvailableLearnLanguages.map(language => {
                          return { label: t(`languages.${language}`), value: language }
                        })}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('manage_home.pricing_discount_tandem')}*</ControlLabel>
                      <ReactBootstrapSlider
                        min={0}
                        max={100}
                        formatter={value => `${value}%`}
                      />
                    </Col>
                  </Row>
                </Panel>
              </div>
            </Collapse>
            <Collapse in={!immersionsEnabled.tandem}>
              <div>
                <Panel>
                  <h3>{t('common.Tandem')}</h3>
                  <p style={styles.descriptionParagraph}>{t('manage_home.stay_description')}</p>
                  <Button bsStyle='primary' onClick={() => this.toggleImmersion('tandem')}>{t('manage_home.enable')}</Button>
                </Panel>
              </div>
            </Collapse>
          </Col>

          <Col xs={12} md={4}>
            <Collapse in={immersionsEnabled.teacher}>
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
                        options={home.data.teacherAvailableLanguages.map(language => {
                          return { label: t(`languages.${language}`), value: language }
                        })}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <ControlLabel>{t('immersions.packages_offered_label')}*</ControlLabel>
                      <MultiSelect
                        theme='bootstrap3'
                        onValuesChange={event => this.handleValueChange('teacher', 'packages', event.map(option => option.value))}
                        options={[
                          { value: 5, label: `5 ${t('immersions.hours_per_week_short')}` },
                          { value: 10, label: `10 ${t('immersions.hours_per_week_short')}` },
                          { value: 15, label: `15 ${t('immersions.hours_per_week_short')}` },
                        ]}
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
            <Collapse in={!immersionsEnabled.teacher}>
              <div>
                <Panel>
                  <h3>{t('common.Teachers_stay')}</h3>
                  <p style={styles.descriptionParagraph}>{t('manage_home.stay_description')}</p>
                  <Button bsStyle='primary' onClick={() => this.toggleImmersion('teacher')}>{t('manage_home.enable')}</Button>
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
        <Modal show={certificationModalOpen} onHide={this.closeCertificationModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
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
  t: PropTypes.func,
  token: PropTypes.string,
}
