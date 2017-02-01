// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, Grid, Modal, Panel, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { BackgroundColorBlock, FeaturedHomes, HowDoesItWork, InlineSearchUnit } from 'components'
import { translate } from 'react-i18next'
import Radium from 'radium'
import Testimonial from 'components/Testimonial/Testimonial'
import { freshGreen, headerPink, warmPurple, saturatedPurple, headerBluePurple } from 'styles/colors'

// Relative imports
import styles from './Main.styles'

@translate()
@Radium
export default class Main extends Component {

  state = {
    howDoesItWorkModalOpen: false,
  }

  openHowDoesItWorkModal = () => this.setState({ howDoesItWorkModalOpen: true })
  closeHowDoesItWorkModal = () => this.setState({ howDoesItWorkModalOpen: false })

  render() {

    const { t } = this.props

    return (
      <div>

        <Helmet title={t('main.title')} />
        <div style={styles.hero}>

          <Grid style={styles.heroTextContent}>
            <Row>
              <Col xs={12}>
                <h1 style={styles.h1}>{t('common.go_abroad_and_immerse')}</h1>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Button onClick={this.openHowDoesItWorkModal} bsStyle='primary' className='hidden-xs hidden-sm' bsSize='small' style={styles.button}>{t('common.how_does_it_work')}</Button>
              </Col>
            </Row>
          </Grid>

          <div style={styles.heroInputRow}>
            <InlineSearchUnit standalone shadow />
          </div>

        </div>

        <div style={styles.relative}>
          <Grid style={styles.paddedGrid}>
            <Row style={{ marginBottom: 50 }}>
              <Col xs={10} xsOffset={1} sm={8} smOffset={2} md={8} mdOffset={2} lg={6} lgOffset={3}>
                <h3 className='header-green' style={styles.centerAlign}>{t('common.most_popular_immersions')}</h3>
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
          <FeaturedHomes />
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
        <Modal
          bsSize='large'
          show={this.state.howDoesItWorkModalOpen}
          onHide={this.closeHowDoesItWorkModal}
        >
          <HowDoesItWork />
        </Modal>
      </div>
    )
  }
}

Main.propTypes = {
  dispatch: PropTypes.func,
  t: PropTypes.func,
}
