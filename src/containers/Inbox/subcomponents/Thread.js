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
    loading: state.messaging[`thread_${ownProps.thread.id}`] ? state.messaging[`thread_${ownProps.thread.id}`].loading : false,
    messages: state.messaging[`thread_${ownProps.thread.id}`] || [],
  })
)
@translate()
export default class Thread extends Component {

  state = {
    lastTimestamp: null,
    newMessage: '',
    cachedMessages: [],
  }

  componentDidMount = () => {
    const { dispatch, token, thread, messages, loading } = this.props
    if (!loading && messages.length === 0) {
      dispatch(loadMessageThread(token, thread.id, { data: [] }, 10))
    }
  }

  componentDidUpdate = () => {
    const container = document.getElementById(`inbox-pane-${this.props.thread.id}`)
    container.scrollTop = container.scrollHeight
  }

  handleTextareaChange = value => {
    this.setState({ newMessage: value })
  }

  sendMessage = () => {
    const { newMessage } = this.state
    const { dispatch, token, thread, messages } = this.props
    if (newMessage) {
      dispatch(sendMessage(token, thread.id, { message: newMessage }, () => {
        dispatch(loadMessageThread(token, thread.id, messages, 1))
        this.resetForm()
      }))
    }
  }

  resetForm = () => {
    this.setState({ newMessage: '' })
  }

  render() {

    const { dispatch, t, token, thread, jwt, messages } = this.props

    const sortedMessages = Array.isArray(messages.data) ? messages.data.sort((a, b) => {
      return new Date(a.timestamp) - new Date(b.timestamp)
    }) : []

    return (
      <Tab.Pane eventKey={thread.id} style={styles.thread}>
        {sortedMessages.length > 0 &&
          <div style={styles.loadMoreLink}><a onClick={() => dispatch(loadMessageThread(token, thread.id, messages, 10))}>{t('inbox.load_previous')}</a></div>
        }
        {sortedMessages.map(message => {
          return (
            <SingleMessage
              key={`${message.timestamp}`}
              author={jwt.rid === message.author ? 'you' : 'them'}
              content={message.message}
              photo={jwt.rid === message.author ? jwt.img : thread.with.photo}
            />
            )
        })}
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
  loading: PropTypes.bool,
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  t: PropTypes.func,
  thread: PropTypes.object,
  token: PropTypes.string,
  messages: PropTypes.array,
}
