// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col } from 'react-bootstrap'
import config from 'config'
import { translate } from 'react-i18next'
import FontAwesome from 'react-fontawesome'

// Relative imports
import styles from '../Thread.styles.js'

@translate()
export default class SingleMessage extends Component {

  render() {

    const { author, content, photo } = this.props

    return (
      <div style={styles.messageContainer}>
        {author === 'you' &&
          <div>
            <Col xsHidden sm={2}>
              <div style={Object.assign({}, styles.smallProfilePicture, { backgroundImage: `url(${config.img}${photo || '/users/default.jpg?w=100'})` })} />
            </Col>
            <Col xs={10} sm={8} md={7} style={Object.assign({}, styles.message, styles.messageLeft)}>
              <FontAwesome name='caret-left' style={styles.caretLeft} />
              {content}
            </Col>
          </div>
        }
        {author === 'them' &&
          <div>
            <Col xs={10} xsOffset={2} sm={8} smOffset={2} md={7} mdOffset={3} style={Object.assign({}, styles.message, styles.messageRight)}>
              <FontAwesome name='caret-right' style={styles.caretRight} />
              {content}
            </Col>
            <Col xsHidden sm={2} style={{ textAlign: 'right' }}>
              <div style={Object.assign({}, styles.smallProfilePicture, { backgroundImage: `url(${config.img}${photo || '/users/default.jpg?w=100'})` })} />
            </Col>
          </div>
        }
      </div>
    )
  }
}

SingleMessage.propTypes = {
  author: PropTypes.string,
  content: PropTypes.string,
  photo: PropTypes.string,
}
