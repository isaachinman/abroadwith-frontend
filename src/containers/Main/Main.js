// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, Form, Image, Grid, Panel, Row } from 'react-bootstrap'
import config from 'config'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { BackgroundColorBlock, DateRangePicker } from 'components'
import { translate } from 'react-i18next'
import { SimpleSelect as Select } from 'react-selectize'
import Radium from 'radium'
import Testimonial from 'components/Testimonial/Testimonial'
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
@Radium
export default class Main extends Component {

  state = {
    modals: {
      howDoesItWork: {
        open: false,
      },
    },
  }

  handleSearch = () => {
    this.props.dispatch(push('/homestays/search'))
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
                <Button bsStyle='primary' className='hidden-xs hidden-sm' bsSize='small' style={styles.button}>{t('common.how_does_it_work')}</Button>
              </Col>
            </Row>
          </Grid>

          <Row style={styles.heroInputRow} className='inline-search-unit-row'>
            <Form inline>
              <div className='inline-search-unit'>
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
                <Button onClick={this.handleSearch} bsSize='large' className='search-btn' style={styles.searchBtn}>{t('common.search')}</Button>
              </div>

            </Form>
          </Row>

        </div>

        <div style={styles.relative}>
          <Grid style={styles.paddedGrid}>
            <Row style={{ marginBottom: 50 }}>
              <Col xs={10} xsOffset={1} sm={8} smOffset={2} md={8} mdOffset={2} lg={6} lgOffset={3}>
                <h3 className='header-green'>{t('common.most_popular_immersions')}</h3>
                <p>{t('common.you_may_book_school')}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4}>
                <Panel style={styles.immersionPanel}>
                  <h3 className='header-pink'>{t('common.Stay')}</h3>
                  <p style={styles.immersionDescription}>{t('common.stay_description')}</p>
                  <Button bsSize='xsmall' style={Object.assign({}, styles.immersionBtn, { background: warmPurple })}>{t('common.find_host')}</Button>
                </Panel>
              </Col>
              <Col xs={12} md={4}>
                <Panel style={styles.immersionPanel}>
                  <h3 className='header-blue'>{t('common.Tandem')}</h3>
                  <p style={styles.immersionDescription}>{t('common.tandem_description')}</p>
                  <Button bsSize='xsmall' style={Object.assign({}, styles.immersionBtn, { background: saturatedPurple })} >{t('common.find_host')}</Button>
                </Panel>
              </Col>
              <Col xs={12} md={4}>
                <Panel style={styles.immersionPanel}>
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
          <Row style={{ marginBottom: 60 }}>
            <Col xs={10} xsOffset={1} sm={8} smOffset={2} md={8} mdOffset={2} lg={6} lgOffset={3}>
              <h3 className='header-green'>{t('main.how_does_it_work_title')}</h3>
              <p>{t('main.meta_description')}</p>
            </Col>
          </Row>
          <Row>
            <Col style={styles.howItWorksBox} xs={10} xsOffset={1} sm={8} smOffset={2} md={4} mdOffset={0}>
              <h4 style={styles.bigNumber}>1.</h4>
              <Image src={`${config.img}/app/how_it_works/how_it_works_1_floating.png`} alt='How it works #1' style={styles.howItWorksImage} rounded responsive />
              <h5 className='header-saturated-purple'>{t('common.discover')}</h5>
              <p>{t('common.discover_description')}</p>
            </Col>
            <Col style={styles.howItWorksBox} xs={10} xsOffset={1} sm={8} smOffset={2} md={4} mdOffset={0}>
              <h4 style={styles.bigNumber}>2.</h4>
              <Image src={`${config.img}/app/how_it_works/how_it_works_2_floating.png`} alt='How it works #2' style={styles.howItWorksImage} rounded responsive />
              <h5 className='header-saturated-purple'>{t('common.book_immersion')}</h5>
              <p>{t('common.book_immersion_description', { stay: t('common.stay'), tandem: t('common.tandem'), teachers_stay: t('common.teachers_stay') })}</p>
            </Col>
            <Col style={styles.howItWorksBox} xs={10} xsOffset={1} sm={8} smOffset={2} md={4} mdOffset={0}>
              <h4 style={styles.bigNumber}>3.</h4>
              <Image src={`${config.img}/app/how_it_works/how_it_works_3_floating.png`} alt='How it works #3' style={styles.howItWorksImage} rounded responsive />
              <h5 className='header-saturated-purple'>{t('common.book_language_course')}</h5>
              <p>{t('common.book_language_course_description')}</p>
            </Col>
          </Row>
        </Grid>

        <div style={styles.relative}>
          <Grid style={styles.paddedGrid}>
            <Row style={{ marginBottom: 60, textAlign: 'center' }}>
              <Col xs={10} xsOffset={1} sm={8} smOffset={2} md={8} mdOffset={2} lg={6} lgOffset={3}>
                <h3 className='header-warm-purple'>{t('testimonials.title')}</h3>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={10} smOffset={1} lg={8} lgOffset={2}>
                <Testimonial
                  type='student'
                  person='daniel'
                />
                <Testimonial
                  type='student'
                  person='isabel'
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} style={styles.hostBtnRow}>
                <Button bsSize='xsmall' style={Object.assign({}, styles.hostBtn, { background: saturatedPurple })} >{t('common.see_more_testimonials')}</Button>
              </Col>
            </Row>
            <BackgroundColorBlock color={headerPink} minHeight={320} />
          </Grid>
        </div>
        <div style={{ marginBottom: -20 }} />
      </div>
    )
  }
}

Main.propTypes = {
  dispatch: PropTypes.func,
  uiLanguage: PropTypes.string,
  t: PropTypes.func,
}
