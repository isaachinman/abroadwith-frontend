import React, { Component } from 'react'
import Helmet from 'react-helmet'
import styles from './Home.styles'

export default class Home extends Component {
  render() {
    return (
      <div>
        
        <Helmet title='Home' />
        <div style={styles.hero}>
          <div className='container'>

            <h1 style={styles.h1}>Go abroad</h1>
            <h2 style={styles.h2}>Immerse in a new language and culture.</h2>

          </div>
        </div>

        <div className='container'></div>

      </div>
    )
  }
}
