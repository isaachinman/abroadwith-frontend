// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Button, Col, ControlLabel, FormControl, FormGroup, Row } from 'react-bootstrap'
import CharacterCounter from 'components/CharacterCounter/CharacterCounter'
import debounce from 'debounce'

@translate()
export default class HomeDescription extends Component {

  state = {
    description: this.props.home.data.description,
  }

  handleValueChange = debounce((field, value) => {
    const { description } = this.state
    description[field] = value
    this.setState({ description })
  }, 200)

  updateDescription = () => {
    this.props.updateHome(Object.assign({}, this.props.home.data, {
      description: this.state.description,
    }))
  }

  render() {

    const { description } = this.state
    const { home, inProgress, t } = this.props

    const formIsValid = description.summary && description.summary.length > 5
    const loading = home.loading

    return (

      <FormGroup>

        <Row>
          <Col xs={12}>
            <FormGroup>
              <ControlLabel>{t('manage_home.description_summary_label')}*</ControlLabel>
              <CharacterCounter>
                <FormControl
                  componentClass='textarea'
                  placeholder={t('manage_home.description_summary_placeholder')}
                  style={{ minHeight: 160 }}
                  defaultValue={description.summary}
                  onChange={event => this.handleValueChange('summary', event.target.value)}
                  maxLength={510}
                />
              </CharacterCounter>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={6}>
            <FormGroup>
              <ControlLabel>{t('manage_home.description_rules_label')}</ControlLabel>
              <CharacterCounter>
                <FormControl
                  componentClass='textarea'
                  placeholder={t('manage_home.description_rules_placeholder')}
                  style={{ minHeight: 160 }}
                  defaultValue={description.rules}
                  onChange={event => this.handleValueChange('rules', event.target.value)}
                  maxLength={255}
                />
              </CharacterCounter>
            </FormGroup>
          </Col>
          <Col xs={12} md={6}>
            <FormGroup>
              <ControlLabel>{t('manage_home.description_neighbourhood_label')}</ControlLabel>
              <CharacterCounter>
                <FormControl
                  componentClass='textarea'
                  placeholder={t('manage_home.description_neighbourhood_placeholder')}
                  style={{ minHeight: 160 }}
                  defaultValue={description.neighbourhood}
                  onChange={event => this.handleValueChange('neighbourhood', event.target.value)}
                  maxLength={255}
                />
              </CharacterCounter>
            </FormGroup>
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
            <Button onClick={this.updateDescription} disabled={!formIsValid || loading} bsStyle='primary'>
              {loading && <span>{t('common.Loading')}</span>}
              {!loading && (inProgress ? <span>{t('manage_home.next_button')}</span> : <span>{t('manage_home.save_button')}</span>)}
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
