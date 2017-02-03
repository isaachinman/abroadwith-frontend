// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button, Col, Grid, Form, FormControl, Panel, Row } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { loadMessages, loadMessageThread, sendMessage } from 'redux/modules/privateData/messaging/messaging'
import SpinLoader from 'components/SpinLoader/SpinLoader'

// Relative imports
import SingleMessage from './subcomponents/SingleMessage'
import styles from './Thread.styles.js'
import ThreadHomeInfo from './subcomponents/ThreadHomeInfo'

@connect(
  (state, ownProps) => ({
    jwt: state.auth.jwt,
    thread: state.messaging.allThreads ? state.messaging.allThreads.filter(thread => thread.id === parseInt(ownProps.params.threadID))[0] : null,
    token: state.auth.token,
    loading: state.messaging[`thread_${ownProps.params.threadID}`] ? state.messaging[`thread_${ownProps.params.threadID}`].loading : false,
    messages: state.messaging[`thread_${ownProps.params.threadID}`] || {},
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

    const { dispatch, token, thread } = this.props

    // The thread object is a small informational object about the thread itself,
    // it doesn't contain any messages

    // If a user hits the thread route without coming through the Inbox,
    // the thread object won't be preloaded
    if (!thread) {
      dispatch(loadMessages(token))
    } else {

      // Get some messages
      dispatch(loadMessageThread(token, thread.id, { data: [] }, 10))

    }
  }

  componentWillReceiveProps = nextProps => {
    if (!this.props.thread && nextProps.thread && nextProps.thread.id) {
      // Get some messages
      const { dispatch, token } = this.props
      dispatch(loadMessageThread(token, nextProps.thread.id, { data: [] }, 10))
    }
  }

  componentDidUpdate = () => {
    const { thread } = this.props
    if (thread && thread.id) {
      const container = document.getElementById(`inbox-pane-${this.props.thread.id}`)
      if (container !== null) {
        container.scrollTop = container.scrollHeight
      }
    }
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

    console.log(this)

    return (
      <Grid>
        <Helmet title={`${t('inbox.conversation_with')} ${thread ? thread.with.firstName : ''}`} />
        <Row style={styles.mainRow}>
          <Col xs={12} md={4} lg={3}>
            <Panel style={styles.homeInfoContainer}>
              {thread && thread.homeId &&
                <ThreadHomeInfo thread={thread} />
              }
            </Panel>
          </Col>
          <Col xs={12} md={8} lg={9}>
            <SpinLoader show={typeof messages.loading !== 'undefined' ? messages.loading : true}>
              <Panel>
                {thread && thread.id && messages && messages.data &&
                  <div style={styles.thread}>
                    <div id={`inbox-pane-${thread.id}`} style={styles.scrollMessages}>
                      {sortedMessages.length > 0 && !messages.endOfThread &&
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
                    </div>
                    <Form ref={c => { this.form = c }} inline style={styles.messageForm}>
                      <FormControl
                        value={this.state.newMessage}
                        componentClass='textarea'
                        style={styles.messageInput}
                        placeholder={t('common.First_name')}
                        onChange={event => this.handleTextareaChange(event.target.value)}
                      />
                      <Button onClick={this.sendMessage} bsStyle='success' style={styles.sendBtn}>{t('inbox.message_modal_btn')}</Button>
                    </Form>
                  </div>
                }
              </Panel>
            </SpinLoader>
          </Col>
        </Row>
      </Grid>
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
