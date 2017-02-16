// Absolute imports
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { Button, Col, ControlLabel, FormControl, FormGroup, Row } from 'react-bootstrap'
import HomeData from 'data/constants/HomeData'
import { MultiSelect } from 'react-selectize'
import Switch from 'antd/lib/switch'

@translate()
export default class HomeBasics extends Component {

  state = {
    basics: {
      AMENITIES: [],
      EXTRAS: [],
      FOOD_OPTION: [],
      PREFERENCES: [],
      SAFETY: [],
      family: false,
      homeType: 'FLAT',
    },
  }

  componentWillReceiveProps = nextProps => {
    const { home, inProgress, activeStep } = nextProps
    if (home && home.loaded && home.data.basics && (!inProgress || (inProgress && activeStep.stepNum > 2))) {
      this.setState({
        basics: home.data.basics,
      })
    }
  }

  handleValueChange = (field, data) => {
    const basics = this.state.basics
    basics[field] = data
    this.setState({ basics })
  }

  updateBasics = () => {
    this.props.updateHome(Object.assign({}, this.props.home.data, {
      basics: this.state.basics,
    }))
  }

  render() {

    const { basics } = this.state
    const { home, inProgress, t } = this.props

    const loading = home.loading

    return (

      <form>
        <FormGroup
          controlId='homeBasics'
          validationState={null}
        >
          <Row>
            <Col xs={12} md={6}>
              <ControlLabel>{t('homes.home_types_placeholder')}*</ControlLabel>
              <FormControl
                componentClass='select'
                onChange={event => this.handleValueChange('homeType', event.target.value)}
                value={basics.homeType}
              >
                {HomeData.homeTypes.map(homeType => {
                  return (
                    <option value={homeType} key={homeType}>{t(`homes.home_types.${homeType}`)}</option>
                  )
                })}
              </FormControl>
            </Col>

            <Col xs={12} md={6}>
              <ControlLabel>{t('homes.home_safety_label')}</ControlLabel>
              <div>
                <MultiSelect
                  theme='bootstrap3'
                  placeholder={t('homes.home_safety_placeholder')}
                  onValuesChange={event => this.handleValueChange('SAFETY', event.map(option => option.value))}
                  options={HomeData.homeSettings.SAFETY.map(safetyItem => {
                    return { label: t(`homes.home_safety.${safetyItem}`), value: safetyItem }
                  })}
                  values={basics.SAFETY.map(safetyItem => {
                    return { label: t(`homes.home_safety.${safetyItem}`), value: safetyItem }
                  })}
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6}>
              <ControlLabel>{t('homes.diets_offered_label')}</ControlLabel>
              <div>
                <MultiSelect
                  theme='bootstrap3'
                  placeholder={t('homes.diets_offered_placeholder')}
                  onValuesChange={event => this.handleValueChange('FOOD_OPTION', event.map(option => option.value))}
                  options={HomeData.homeServices.FOOD_OPTION.map(foodOptionItem => {
                    return { label: t(`homes.diets_offered.${foodOptionItem}`), value: foodOptionItem }
                  })}
                  values={basics.FOOD_OPTION.map(safetyItem => {
                    return { label: t(`homes.diets_offered.${safetyItem}`), value: safetyItem }
                  })}
                />
              </div>
            </Col>

            <Col xs={12} md={6}>
              <ControlLabel>{t('homes.extras_label')}</ControlLabel>
              <div>
                <MultiSelect
                  theme='bootstrap3'
                  placeholder={t('homes.extras_placeholder')}
                  onValuesChange={event => this.handleValueChange('EXTRAS', event.map(option => option.value))}
                  options={HomeData.homeSettings.EXTRAS.map(extrasItem => {
                    return { label: t(`homes.extras.${extrasItem}`), value: extrasItem }
                  })}
                  values={basics.EXTRAS.map(safetyItem => {
                    return { label: t(`homes.extras.${safetyItem}`), value: safetyItem }
                  })}
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6}>
              <ControlLabel>{t('homes.amenities_label')}</ControlLabel>
              <div>
                <MultiSelect
                  theme='bootstrap3'
                  placeholder={t('homes.amenities_placeholder')}
                  onValuesChange={event => this.handleValueChange('AMENITIES', event.map(option => option.value))}
                  options={HomeData.homeSettings.AMENITIES.map(amenityItem => {
                    return { label: t(`homes.amenities.${amenityItem}`), value: amenityItem }
                  })}
                  values={basics.AMENITIES.map(safetyItem => {
                    return { label: t(`homes.amenities.${safetyItem}`), value: safetyItem }
                  })}
                />
              </div>
            </Col>
            <Col xs={12} md={6}>
              <ControlLabel>{t('homes.preferences_label')}</ControlLabel>
              <div>
                <MultiSelect
                  theme='bootstrap3'
                  placeholder={t('homes.preferences_placeholder')}
                  onValuesChange={event => this.handleValueChange('PREFERENCES', event.map(option => option.value))}
                  options={HomeData.homeSettings.PREFERENCES.map(preferencesItem => {
                    return { label: t(`homes.preferences.${preferencesItem}`), value: preferencesItem }
                  })}
                  values={basics.PREFERENCES.map(safetyItem => {
                    return { label: t(`homes.preferences.${safetyItem}`), value: safetyItem }
                  })}
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6}>
              <ControlLabel>{t('homes.family_label')}</ControlLabel>
              <div>
                <Switch
                  onChange={checked => this.handleValueChange('family', checked)}
                  unCheckedChildren={t('common.words.No')}
                  checkedChildren={t('common.words.Yes')}
                  checked={basics.family}
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Button onClick={this.updateBasics} disabled={loading} bsStyle='primary'>
                {loading && <span>{t('common.Loading')}</span>}
                {!loading && (inProgress ? <span>{t('manage_home.next_button')}</span> : <span>{t('manage_home.save_button')}</span>)}
              </Button>
            </Col>
          </Row>

        </FormGroup>
      </form>

    )
  }
}

HomeBasics.propTypes = {
  dispatch: PropTypes.func,
  home: PropTypes.object,
  inProgress: PropTypes.bool,
  t: PropTypes.func,
  updateHome: PropTypes.func,
  token: PropTypes.string,
}
