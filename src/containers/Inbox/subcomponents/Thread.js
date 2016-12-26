// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormControl, Tab } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { loadMessageThread, sendMessage } from 'redux/modules/privateData/messaging/messaging'

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

  state = {
    cachedMessages: [],
    newMessage: '',
  }

  componentWillMount = () => {
    const { dispatch, token, thread, messages } = this.props
    if (!messages) {
      dispatch(loadMessageThread(token, thread.id, 10, false))
    }
  }

  componentDidMount = () => {
    const { messages } = this.props
    const { cachedMessages } = this.state
    if (messages && cachedMessages.length < messages.length) {
      this.cacheMessages(messages)
    }
  }

  handleTextareaChange = value => {
    this.setState({ newMessage: value })
  }

  sendMessage = () => {
    const { newMessage } = this.state
    const { dispatch, token, thread } = this.props
    if (newMessage) {
      dispatch(sendMessage(token, thread.id, { message: newMessage }, () => {
        dispatch(loadMessageThread(token, thread.id, 10, false))
        this.resetForm()
      }))
    }
  }

  resetForm = () => {
    this.setState({ newMessage: '' })
  }

  cacheMessages = messageArray => {
    const { jwt, thread } = this.props
    const cache = this.state.cachedMessages
    messageArray.reverse().map(message => {
      cache.push(
        <SingleMessage
          key={`${message.author}_${message.timestamp}`}
          author={jwt.rid === message.author ? 'you' : 'them'}
          content={message.message}
          photo={jwt.rid === message.author ? jwt.img : thread.with.photo}
        />
      )
    })
    this.setState({ cacheMessages: cache })
  }

  render() {

    const { t, thread } = this.props
    const { cachedMessages } = this.state

    console.log(this)

    return (
      <Tab.Pane eventKey={thread.id} style={styles.thread}>
        {cachedMessages}
        <Form ref={c => { this.form = c }} inline style={styles.messageForm}>
          <FormControl
            value={this.state.newMessage}
            componentClass='textarea'
            style={styles.messageInput}
            placeholder={t('common.First_name')}
            onChange={event => this.handleTextareaChange(event.target.value)}
          />
          <Button onClick={this.sendMessage} bsSize='large' bsStyle='success' style={styles.sendBtn}>
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
