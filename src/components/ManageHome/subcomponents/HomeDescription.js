// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Button, Col, ControlLabel, FormControl, FormGroup, Row } from 'react-bootstrap'
import debounce from 'debounce'

@translate()
export default class HomeDescription extends Component {

  state = {
    description: this.props.home.data.description,
  }

  handleValueChange = debounce((field, value) => {
    const { description } = this.state
    description[`${field}`] = value
    this.setState({ description })
  }, 200)

  updateDescription = () => {
    this.props.updateHome(Object.assign({}, this.props.home.data, {
      description: this.state.description,
    }))
  }

  render() {

    const { description } = this.state
    const { inProgress, t } = this.props

    const formIsValid = description.summary && description.summary.length > 5
    console.log(this)

    return (

      <FormGroup>

        <Row>
          <Col xs={12}>
            <ControlLabel>{t('manage_home.description_summary_label')}*</ControlLabel>
            <FormControl
              componentClass='textarea'
              placeholder={t('manage_home.description_summary_placeholder')}
              style={{ minHeight: 160 }}
              defaultValue={description.summary}
              onChange={event => this.handleValueChange('summary', event.target.value)}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={6}>
            <ControlLabel>{t('manage_home.description_rules_label')}</ControlLabel>
            <FormControl
              componentClass='textarea'
              placeholder={t('manage_home.description_rules_placeholder')}
              style={{ minHeight: 160 }}
              defaultValue={description.rules}
              onChange={event => this.handleValueChange('rules', event.target.value)}
            />
          </Col>
          <Col xs={12} md={6}>
            <ControlLabel>{t('manage_home.description_neighbourhood_label')}</ControlLabel>
            <FormControl
              componentClass='textarea'
              placeholder={t('manage_home.description_neighbourhood_placeholder')}
              style={{ minHeight: 160 }}
              defaultValue={description.neighbourhood}
              onChange={event => this.handleValueChange('neighbourhood', event.target.value)}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={6}>
            <ControlLabel>{t('manage_home.description_youtube_label')}</ControlLabel>
            <FormControl
              type='text'
              placeholder={t('manage_home.description_youtube_placeholder')}
              defaultValue={description.video}
              onChange={event => this.handleValueChange('video', event.target.value)}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Button onClick={this.updateDescription} disabled={!formIsValid} bsStyle='primary'>
              {inProgress ? <span>{t('manage_home.next_button')}</span> : <span>{t('manage_home.save_button')}</span>}
            </Button>
          </Col>
        </Row>

      </FormGroup>

    )
  }
}

HomeDescription.propTypes = {
  dispatch: PropTypes.func,
  home: PropTypes.object,
  inProgress: PropTypes.bool,
  t: PropTypes.func,
  updateHome: PropTypes.func,
  token: PropTypes.string,
}
