import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { Grid, Row, Col, Nav, NavItem, Tab } from 'react-bootstrap'
import { translate } from 'react-i18next'
import Helmet from 'react-helmet'
import { loadMessages } from 'redux/modules/privateData/messaging/messaging'
import uiDate from 'utils/dates/uiDate'
import config from 'config'

// Relative imports
import styles from './Inbox.styles.js'
import Thread from './subcomponents/Thread'

@asyncConnect([{
  promise: state => {

    const { dispatch, getState } = state.store
    return dispatch(loadMessages(getState().auth.token))

  },
}])
@connect(
  state => ({
    messages: state.messaging.messages,
    token: state.auth.token,
    jwt: state.auth.jwt,
  })
)
@translate()
export default class Inbox extends Component {

  state = {
    activeThread: this.props.messages[0].id,
  }

  handleSelect = threadID => {
    this.setState({ activeThread: threadID })
  }

  render() {

    const { t, token, messages, jwt } = this.props

    const { activeThread } = this.state

    console.log(activeThread)

    return (
      <Grid style={styles.grid}>

        <Helmet title={t('inbox.title')} />

        <Tab.Container id='inbox' activeKey={this.state.activeThread} onSelect={this.handleSelect}>
          <Row>
            <Col xs={4} style={Object.assign({}, styles.inboxContainer, styles.sidebar)}>
              <Nav bsStyle='pills' stacked>
                {messages.map(message => {
                  return (
                    <NavItem key={`sidebar-tab-${message.id}`} eventKey={message.id}>
                      <img src={`${config.img}${message.with.photo}`} alt={`Other person: ${message.id}`} />
                      <div style={styles.sidebarCopy}>
                        <div style={styles.floatLeft}>
                          <div>{t('inbox.conversation_with')} <strong>{message.with.firstName ? message.with.firstName : null}</strong></div>
                          <div style={styles.sidebarDates}>{uiDate(message.arrival)} {t('common.words.to')} {uiDate(message.departure)}</div>
                        </div>
                      </div>
                    </NavItem>
                  )
                })}
              </Nav>
            </Col>
            <Col xs={8} style={styles.inboxContainer}>
              <Tab.Content animation>
                {messages.filter(message => message.id === activeThread).map(message => {
                  return (
                    <Thread key={`thread-${message.id}`} thread={message} jwt={jwt} token={token} />
                  )
                })}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Grid>
    )
  }
}

Inbox.propTypes = {
  messages: PropTypes.array,
  jwt: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
