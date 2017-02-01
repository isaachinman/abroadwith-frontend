// Absolute imports
import { Col, Image, Row } from 'react-bootstrap'
import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import config from 'config'

// Relative imports
import styles from './HowDoesItWork.styles'

@translate()
export default class HowDoesItWork extends Component {

  render() {

    const {
      t,
    } = this.props

    return (
      <div style={styles.container}>
        <Row style={{ marginBottom: 30 }}>
          <Col xs={10} xsOffset={1} sm={8} smOffset={2} md={8} mdOffset={2}>
            <h3 className='header-green' style={styles.centerAlign}>{t('main.how_does_it_work_title')}</h3>
          </Col>
        </Row>
        <Row>
          <Col style={styles.howItWorksBox} xs={10} xsOffset={1} sm={8} smOffset={2} md={4} mdOffset={0}>
            <h4 style={styles.bigNumber}>1</h4>
            <Image src={`${config.img}/app/how_it_works/how_it_works_v2_1.jpg`} alt='How it works #1' thumbnail responsive />
            <h5 className='header-saturated-purple'>{t('common.discover')}</h5>
            <p>{t('common.discover_description')}</p>
          </Col>
          <Col style={styles.howItWorksBox} xs={10} xsOffset={1} sm={8} smOffset={2} md={4} mdOffset={0}>
            <h4 style={styles.bigNumber}>2</h4>
            <Image src={`${config.img}/app/how_it_works/how_it_works_v2_2.jpg`} alt='How it works #2' thumbnail responsive />
            <h5 className='header-saturated-purple'>{t('common.book_immersion')}</h5>
            <p>{t('common.book_immersion_description', { stay: t('common.stay'), tandem: t('common.tandem'), teachers_stay: t('common.teachers_stay') })}</p>
          </Col>
          <Col style={styles.howItWorksBox} xs={10} xsOffset={1} sm={8} smOffset={2} md={4} mdOffset={0}>
            <h4 style={styles.bigNumber}>3</h4>
            <Image src={`${config.img}/app/how_it_works/how_it_works_v2_3.jpg`} alt='How it works #3' thumbnail responsive />
            <h5 className='header-saturated-purple'>{t('common.book_language_course')}</h5>
            <p>{t('common.book_language_course_description')}</p>
          </Col>
        </Row>
      </div>
    )
  }
}

HowDoesItWork.propTypes = {
  t: PropTypes.func,
}
