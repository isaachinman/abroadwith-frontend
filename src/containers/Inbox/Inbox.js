// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import { BackgroundColorBlock } from 'components'
import { connect } from 'react-redux'
import { Grid, Row, Col, Nav, NavItem, Tab, Panel } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { translate } from 'react-i18next'
import Helmet from 'react-helmet'
import { loadMessages } from 'redux/modules/privateData/messaging/messaging'
import uiDate from 'utils/dates/uiDate'
import config from 'config'

// Relative imports
import styles from './Inbox.styles.js'

@asyncConnect([{
  promise: state => {

    const { dispatch, getState } = state.store
    return dispatch(loadMessages(getState().auth.token))

  },
}])
@connect(
  state => ({
    user: state.privateData.user,
    messages: state.messaging.allThreads,
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

    const { user, t, messages } = this.props
    console.log(user)
    const multiHomeUser = user && user.data && user.data.homeIds && user.data.homeIds.length > 1

    return (
      <span>
        <Helmet title={t('inbox.title')} />
        <BackgroundColorBlock top color='rgba(0,0,0,.02)' minHeight={360} />
        {messages.length > 0 &&
          <Grid style={styles.grid}>
            <Row style={styles.h1Row}>
              <Col xs={12} sm={10} smOffset={1} md={8} mdOffset={2}>
                <h1>{t('inbox.title')}</h1>
              </Col>
            </Row>
            <Tab.Container id='inbox' activeKey={null} onSelect={this.handleSelect}>
              <Row>
                <Col xs={12} sm={10} smOffset={1} md={8} mdOffset={2}>
                  <Panel>
                    <Nav bsStyle='pills' stacked>
                      {messages.map(message => {
                        return (
                          <LinkContainer to={`/thread/${message.id}`} key={`thread-link-${message.id}`}>
                            <NavItem href='somewhere'>
                              <img src={`${config.img}${message.with.photo || '/users/default.jpg?w=100'}`} alt={`Other person: ${message.id}`} />
                              <div style={styles.sidebarCopy}>
                                <div style={styles.floatLeft}>
                                  <div>
                                    {t('inbox.conversation_with')} <strong>{message.with.firstName ? message.with.firstName : null}</strong>
                                    {multiHomeUser &&
                                      <span>&nbsp;({message.homeId})</span>
                                    }
                                  </div>
                                  <div style={styles.sidebarDates}>{uiDate(message.arrival)} {t('common.words.to')} {uiDate(message.departure)}</div>
                                </div>
                              </div>
                            </NavItem>
                          </LinkContainer>
                        )
                      })}
                    </Nav>
                  </Panel>
                </Col>
              </Row>
            </Tab.Container>
          </Grid>
        }
        {messages.length === 0 &&
          <Grid style={styles.grid}>
            <Row>
              <Col xs={12} md={6} mdOffset={3}>
                <Panel style={{ marginTop: 80 }}>
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
  user: PropTypes.object,
  t: PropTypes.func,
}
