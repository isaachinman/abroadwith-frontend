// Absolute imports
import { Button, Form, FormGroup, Grid, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import React, { Component, PropTypes } from 'react'
import { DateRangePicker } from 'components'
import { translate } from 'react-i18next'

// Relative imports
import styles from './Main.styles'

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

    const { t } = this.props

    return (
      <div>

        <Helmet title='Main' />
        <div style={styles.hero}>

          <Grid>
            <h1 style={styles.h1}>{t('common.book_immersion')}</h1>
            <h2 style={styles.h2}>{t('trips.reservation_with', { immersion: t('immersions.STAY'), guest: 'TEST HOSTNAME' })}</h2>
            <Button bsSize='large' style={styles.button}>How does it work?</Button>
          </Grid>

          <Row style={styles.heroInputRow}>
            <Form inline bsSize='large'>
              <FormGroup bsSize='large'>
                <input style={styles.inputFieldLeft} className='form-control' placeholder='Pick a language to learn' />
                <input style={styles.inputFieldMiddle} className='form-control' placeholder='Pick a place to learn it' />
                <DateRangePicker
                  inlineBlock
                  large
                  startDatePlaceholderText='Arrival'
                  endDatePlaceholderText='Departure'
                />
                <select style={Object.assign({}, styles.inputFieldMiddle, styles.guestSelect)} className='form-control'>
                  <option value={1}>1 guest</option>
                </select>
                <Button bsSize='large' style={Object.assign({}, styles.inputFieldRight, styles.submitBtn)} bsStyle='success'>Search</Button>
              </FormGroup>

            </Form>
          </Row>

        </div>

        <Grid>

          Main stuff

        </Grid>

      </div>
    )
  }
}

Main.propTypes = {
  t: PropTypes.func,
}
