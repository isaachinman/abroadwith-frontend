// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import { connect } from 'react-redux'
import { Grid, Row, Col, Nav, NavItem, Tab, Panel } from 'react-bootstrap'
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
    messages: state.messaging.allThreads,
    token: state.auth.token,
    jwt: state.auth.jwt,
  })
)
@translate()
export default class Inbox extends Component {

  state = {
    activeThread: this.props.messages.length > 0 ? this.props.messages[0].id : null,
  }

  handleSelect = threadID => {
    this.setState({ activeThread: threadID })
  }

  render() {

    const { t, token, messages, jwt } = this.props
    const { activeThread } = this.state

    return (
      <span>
        <Helmet title={t('inbox.title')} />
        {messages.length > 0 &&
          <Grid style={styles.grid}>

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
                  <Tab.Content animation={false} style={styles.threadContainer}>
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
        }
        {messages.length === 0 &&
          <Grid style={Object.assign({}, styles.grid, { background: 'none' })}>
            <Row>
              <Col xs={12} md={6} mdOffset={3}>
                <Panel>
                  <h3>{t('inbox.no_messages_title')}</h3>
                  <p>{t('inbox.thread_will_be_here')}</p>
                </Panel>
              </Col>
            </Row>
          </Grid>
        }
      </span>
    )
  }
}

Inbox.propTypes = {
  messages: PropTypes.array,
  jwt: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
