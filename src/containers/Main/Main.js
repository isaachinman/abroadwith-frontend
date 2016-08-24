// Absolute imports
import { Button } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import React from 'react'

// Relative imports
import styles from './Main.styles'

export default function Main() {

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

        <Link to='/homestay/132'>Link to a homestay</Link>
        <Link to='/users/389'>Link to a user profile</Link>

      </div>

    </div>
  )

}
