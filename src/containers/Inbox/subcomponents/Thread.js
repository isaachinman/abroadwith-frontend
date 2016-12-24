import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
// import { connect } from 'react-redux'
import { Tab } from 'react-bootstrap'
import { translate } from 'react-i18next'
// import { loadMessageThread } from 'redux/modules/privateData/messaging/messaging'

@asyncConnect([{
  key: 'lunch',
  promise: () => Promise.resolve({ id: 1, name: 'Borsch' }),
}])
@translate()
export default class Thread extends Component {

  render() {

    const { thread } = this.props
    console.log(this)

    return (
      <Tab.Pane eventKey={thread.id}>
        {thread.id}
      </Tab.Pane>
    )
  }
}

Thread.propTypes = {
  thread: PropTypes.object,
  token: PropTypes.string,
}
