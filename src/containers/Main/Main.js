import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import Helmet from 'react-helmet'
import styles from './Main.styles'

export default class Main extends Component {
  render() {
    return (
      <div>

        <Helmet title='Main' />
        <div style={styles.hero}>
          <div className='container'>

            <h1 style={styles.h1}>Go abroad</h1>
            <h2 style={styles.h2}>Immerse in a new language and culture.</h2>

            <Button bsSize='large' style={styles.button}>How does it work?</Button>

          </div>
        </div>

        <div className='container' style={styles.container}>

        </div>

      </div>
    )
  }
}
