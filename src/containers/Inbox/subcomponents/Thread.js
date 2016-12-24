// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Tab } from 'react-bootstrap'
import { translate } from 'react-i18next'
import { loadMessageThread } from 'redux/modules/privateData/messaging/messaging'

// Relative imports
import SingleMessage from './SingleMessage'

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

    const { jwt, thread, messages } = this.props

    return (
      <Tab.Pane eventKey={thread.id}>
        {typeof messages !== 'undefined' && messages.map(message => {
          return (
            <SingleMessage
              author={jwt.rid === message.author ? 'you' : 'them'}
              content={message.message}
              photo={jwt.rid === message.author ? jwt.img : thread.with.photo}
            />
          )
        })}
      </Tab.Pane>
    )
  }
}

Thread.propTypes = {
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  thread: PropTypes.object,
  token: PropTypes.string,
  messages: PropTypes.array,
}
