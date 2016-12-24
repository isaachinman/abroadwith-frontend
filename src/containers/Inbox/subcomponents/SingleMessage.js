// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Col } from 'react-bootstrap'
import { translate } from 'react-i18next'
import FontAwesome from 'react-fontawesome'

// Relative imports
import styles from '../Inbox.styles.js'

@translate()
export default class SingleMessage extends Component {

  render() {

    const { author, content } = this.props
    console.log(this)

    return (
      <div style={styles.messageContainer}>
        {author === 'you' &&
          <Col xs={10} style={Object.assign({}, styles.message, styles.messageLeft)}>
            <FontAwesome name='caret-left' style={styles.caretLeft} />
            {content}
          </Col>
        }
        {author === 'them' &&
          <Col xs={10} xsOffset={2} style={Object.assign({}, styles.message, styles.messageRight)}>
            <FontAwesome name='caret-right' style={styles.caretRight} />
            {content}
          </Col>
        }
      </div>
    )
  }
}

SingleMessage.propTypes = {
  author: PropTypes.string,
  content: PropTypes.string,
}
