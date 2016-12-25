// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormControl, Tab } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { loadMessageThread } from 'redux/modules/privateData/messaging/messaging'

// Relative imports
import SingleMessage from './SingleMessage'
import styles from '../Inbox.styles.js'

@connect(
  (state, ownProps) => ({
    messages: state.messaging[`thread_${ownProps.thread.id}`],
  })
)
@translate()
export default class Thread extends Component {

  componentWillMount = () => {
    const { dispatch, token, thread, messages } = this.props
    if (!messages) {
      dispatch(loadMessageThread(token, thread.id, 10, false))
    }
  }

  render() {

    const { jwt, t, thread, messages } = this.props
    console.log(this)
    console.log(typeof messages !== 'undefined')

    return (
      <Tab.Pane eventKey={thread.id} style={styles.thread}>
        {typeof messages !== 'undefined' && messages.map(message => {
          return (
            <SingleMessage
              key={`${message.author}_${message.timestamp}`}
              author={jwt.rid === message.author ? 'you' : 'them'}
              content={message.message}
              photo={jwt.rid === message.author ? jwt.img : thread.with.photo}
            />
          )
        })}
        <Form inline style={styles.messageForm}>
          <FormControl
            type='text'
            style={styles.messageInput}
            placeholder={t('common.First_name')}
          />
          <Button type='submit'>
            Send
          </Button>
        </Form>
      </Tab.Pane>
    )
  }
}

Thread.propTypes = {
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  t: PropTypes.func,
  thread: PropTypes.object,
  token: PropTypes.string,
  messages: PropTypes.array,
}
