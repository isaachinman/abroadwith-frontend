// Absolute imports
import { Button, Form, Grid, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import React, { Component } from 'react'
import { DateRangePicker } from 'components'

// Relative imports
import styles from './Main.styles'

export default class Main extends Component {

  state = {
    modals: {
      howDoesItWork: {
        open: false,
      },
    },
  }

  render() {

    return (
      <div>

        <Helmet title='Main' />
        <div style={styles.hero}>

          <Grid>
            <h1 style={styles.h1}>Go abroad</h1>
            <h2 style={styles.h2}>Immerse in a new language and culture.</h2>
            <Button bsSize='large' style={styles.button}>How does it work?</Button>
          </Grid>

          <Row style={styles.heroInputRow}>
            <Form inline>
              <input style={styles.inputFieldLeft} className='form-control' placeholder='Pick a language to learn' />
              <input style={styles.inputFieldMiddle} className='form-control' placeholder='Pick a place to learn it' />
              <DateRangePicker
                inlineBlock
                small
                startDatePlaceholderText='Arrival'
                endDatePlaceholderText='Departure'
              />
              <select style={Object.assign({}, styles.inputFieldMiddle, styles.guestSelect)} className='form-control'>
                <option value={1}>1 guest</option>
              </select>
              <Button style={Object.assign({}, styles.inputFieldRight, styles.submitBtn)} bsStyle='success'>Search</Button>
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
