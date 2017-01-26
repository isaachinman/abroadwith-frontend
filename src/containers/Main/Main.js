// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, Form, FormGroup, Grid, Panel, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { BackgroundColorBlock, DateRangePicker } from 'components'
import { translate } from 'react-i18next'
import { SimpleSelect as Select } from 'react-selectize'
import { Typeahead } from 'react-bootstrap-typeahead'
import { freshGreen, headerPink, warmPurple, saturatedPurple, headerBluePurple } from 'styles/colors'
import Geosuggest from 'react-geosuggest'
import i18n from 'i18n/i18n-client'

// Relative imports
import styles from './Main.styles'

@connect(state => ({
  uiLanguage: state.ui.locale.value,
}))
@translate()
export default class Main extends Component {

  state = {
    modals: {
      howDoesItWork: {
        open: false,
      },
    },
  }

  render() {

    const { uiLanguage, t } = this.props
    const allLanguages = Object.entries(i18n.store.data[uiLanguage].translation.languages).map(([id, label]) => ({ id, label }))

    return (
      <div>

        <Helmet title='Main' />
        <div style={styles.hero}>

          <Grid style={styles.heroTextContent}>
            <Row>
              <Col xs={12}>
                <h1 style={styles.h1}>{t('common.go_abroad_and_immerse')}</h1>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Button bsStyle='primary' bsSize='small' style={styles.button}>{t('common.how_does_it_work')}</Button>
              </Col>
            </Row>
          </Grid>

          <Row style={styles.heroInputRow}>
            <Form inline>
              <FormGroup className='inline-search-unit'>
                <Typeahead
                  placeholder={t('search.language_to_learn')}
                  options={allLanguages}
                />
                <Geosuggest
                  placeholder={t('common.where')}
                  inputClassName='form-control'
                />
                <DateRangePicker
                  inlineBlock
                  large
                  startDatePlaceholderText='Arrival'
                  endDatePlaceholderText='Departure'
                />
                <Select
                  theme='bootstrap3'
                  value={{ value: 1, label: '1 guest' }}
                >
                  <option value={1}>1</option>
                </Select>
                <Button bsSize='large' style={styles.searchBtn}>{t('common.search')}</Button>
              </FormGroup>

            </Form>
          </Row>

        </div>

        <Grid style={styles.paddedGrid}>
          <Row>
            <Col xs={12} md={8} mdOffset={2} lg={6} lgOffset={3}>
              <h3 className='header-green'>{t('common.most_popular_immersions')}</h3>
              <p>{t('common.you_may_book_school')}</p>
            </Col>
          </Row>
        </Grid>

        <div style={styles.relative}>
          <Grid style={styles.paddedGrid}>
            <Row>
              <Col xs={12} md={4}>
                <Panel>
                  <h3 className='header-pink'>{t('common.Stay')}</h3>
                  <p style={styles.immersionDescription}>{t('common.stay_description')}</p>
                  <Button bsSize='xsmall' style={Object.assign({}, styles.immersionBtn, { background: warmPurple })}>{t('common.find_host')}</Button>
                </Panel>
              </Col>
              <Col xs={12} md={4}>
                <Panel>
                  <h3 className='header-blue'>{t('common.Tandem')}</h3>
                  <p style={styles.immersionDescription}>{t('common.tandem_description')}</p>
                  <Button bsSize='xsmall' style={Object.assign({}, styles.immersionBtn, { background: saturatedPurple })} >{t('common.find_host')}</Button>
                </Panel>
              </Col>
              <Col xs={12} md={4}>
                <Panel>
                  <h3 className='header-green'>{t('common.Teacher')}</h3>
                  <p style={styles.immersionDescription}>{t('common.teacher_description')}</p>
                  <Button bsSize='xsmall' style={Object.assign({}, styles.immersionBtn, { background: freshGreen })}>{t('common.find_host')}</Button>
                </Panel>
              </Col>
            </Row>
            <Row>
              <Col xs={12} style={styles.hostBtnRow}>
                <Button bsSize='xsmall' style={Object.assign({}, styles.hostBtn, { background: headerPink })} >{t('common.see_all_hosts')}</Button>
                {t('common.words.or')}
                <Button bsSize='xsmall' style={Object.assign({}, styles.hostBtn, { background: saturatedPurple })}>{t('common.navbar_become_host')}</Button>
              </Col>
            </Row>
          </Grid>
          <BackgroundColorBlock color={headerBluePurple} minHeight={300} />
        </div>

        <Grid style={styles.paddedGrid}>
          <Row>
            <Col xs={12} style={styles.centerAlign}>
              <h3 className='header-green'>{t('main.how_does_it_work_title')}</h3>
            </Col>
          </Row>
        </Grid>

      </div>
    )
  }
}

Main.propTypes = {
  uiLanguage: PropTypes.string,
  t: PropTypes.func,
}
