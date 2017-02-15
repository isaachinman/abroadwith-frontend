// Absolute imports
import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-connect'
import config from 'config'
import { connect } from 'react-redux'
import { Button, Badge, Col, Grid, Navbar, Panel, Row } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { isLoaded, load as loadUser } from 'redux/modules/publicData/users/loadUser'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import Radium from 'radium'
import { translate } from 'react-i18next'

// Relative imports
import styles from './UserProfile.styles'

@asyncConnect([{
  promise: ({ params, store: { dispatch, getState } }) => {

    const result = !isLoaded(getState(), params.userID) ? dispatch(loadUser(params.userID)) : null
    return __CLIENT__ ? null : result

  },
}])
@connect(
  (state, ownProps) => ({
    auth: state.auth,
    error: state.publicData.users.error,
    loading: state.publicData.users.loading,
    user: state.publicData.users[ownProps.params.userID],
  })
)
@translate()
@Radium
export default class UserProfile extends Component {

  componentDidMount = () => document.querySelector('body').scrollTop = 0

  render() {

    const { auth, error, loading, t, user } = this.props
    const hasLived = user && user.hasLived ? ((user.hasLived.replace(/['"]+/g, '')).replace(/[\[\]']/g, '')).split(',') : null
    const hasVisited = user && user.hasVisited ? ((user.hasVisited.replace(/['"]+/g, '')).replace(/[\[\]']/g, '')).split(',') : null

    console.log(this)

    return (
      <div>

        {!error && !loading && user &&

          <span>
            <Helmet title={`${user.firstName}'s ${t('users.title')}`} />

            <Grid style={styles.grid}>

              {auth && auth.loaded && auth.jwt.rid === user.id &&
                <Navbar fluid style={styles.navbar}>
                  <Navbar.Text pullRight>
                    <Link to='/edit-profile'>
                      <Button bsSize='small' bsStyle='success'>{t('users.edit_header')}</Button>
                    </Link>
                  </Navbar.Text>
                </Navbar>
              }

              <div style={styles.bg} />

              <div style={styles.contentContainer}>

                <Row>
                  <Col xs={12}>
                    <div style={styles.topRow}>
                      <h1 style={styles.h1}>{user.firstName} <small>USERTYPE</small></h1>
                      {user.photo &&
                        <div style={Object.assign({}, styles.profileImage, { backgroundImage: `url(${config.img}${user.photo})` })} />
                      }
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12} sm={8}>
                    <p style={styles.aboutMeParagraph}>
                      {user.aboutMe || t('users.no_about_me')}
                    </p>
                  </Col>
                  <Col xs={12} sm={4} lg={3} lgOffset={1}>
                    <Panel header={<h6>{t('admin.verifications_tabname')}</h6>} style={styles.noBoxShadow}>
                      <Row>
                        <Col xs={12}>
                          {t('users.email_label')}
                          <span className='pull-right'>
                            {user.emailVerified ?
                              <FontAwesome name='check' style={styles.greenCheck} /> :
                              <FontAwesome name='times' style={styles.redTimes} />
                              }
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12}>
                          {t('users.phone_number_label')}
                          <span className='pull-right'>
                            {user.phoneVerified ?
                              <FontAwesome name='check' style={styles.greenCheck} /> :
                              <FontAwesome name='times' style={styles.redTimes} />
                              }
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12}>
                          {t('admin.verifications_id_title')}
                          <span className='pull-right'>
                            {user.idVerified ?
                              <FontAwesome name='check' style={styles.greenCheck} /> :
                              <FontAwesome name='times' style={styles.redTimes} />
                              }
                          </span>
                        </Col>
                      </Row>
                    </Panel>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12}>
                    <h4>{t('users.edit_details_title')}</h4>
                  </Col>
                  {user.firstName &&
                    <Col xs={12} sm={6} md={4}>
                      <p>
                        <strong>{t('users.first_name_label')}: </strong>
                        {user.firstName}
                      </p>
                    </Col>
                  }
                  {user.firstName &&
                    <Col xs={12} sm={6} md={4}>
                      <p>
                        <strong>{t('users.home_address_label')}: </strong>
                        {user.homeCity}
                      </p>
                    </Col>
                  }
                  {user.age &&
                    <Col xs={12} sm={6} md={4}>
                      <p>
                        <strong>{t('common.age')}: </strong>
                        {user.age}
                      </p>
                    </Col>
                  }
                  {user.joinedYear &&
                    <Col xs={12} sm={6} md={4}>
                      <p>
                        <strong>{t('common.Joined')}: </strong>
                        {t(`common.months.m${user.joinedMonth}`)}, {user.joinedYear}
                      </p>
                    </Col>
                  }
                  {user.grewUp &&
                    <Col xs={12} sm={6} md={4}>
                      <p>
                        <strong>{t('users.edit_details_grewup_label')}: </strong>
                        {user.grewUp}
                      </p>
                    </Col>
                  }
                  {user.education &&
                    <Col xs={12} sm={6} md={4}>
                      <p>
                        <strong>{t('users.edit_details_education_label')}: </strong>
                        {user.education}
                      </p>
                    </Col>
                  }
                  {user.favouriteBooks &&
                    <Col xs={12} sm={6} md={4}>
                      <p>
                        <strong>{t('users.edit_details_favouritebook_label')}: </strong>
                        {user.favouriteBooks}
                      </p>
                    </Col>
                  }
                  {user.favouriteFilms &&
                    <Col xs={12} sm={6} md={4}>
                      <p>
                        <strong>{t('users.edit_details_favouritefilm_label')}: </strong>
                        {user.favouriteFilms}
                      </p>
                    </Col>
                  }
                </Row>

                <Row>
                  <Col xs={12} md={6}>
                    <h4>{t('common.Languages')}</h4>
                    <p>
                      <strong style={styles.languageMinWidth}>{t('common.Speaks')}:</strong>{user.languagesKnown.map(lang => <Badge key={`speak-${lang.language}`}>{t(`languages.${lang.language}`)}</Badge>)}
                    </p>
                    {user.languagesLearning.length > 0 &&
                      <p>
                        <strong style={styles.languageMinWidth}>{t('common.Learning')}:</strong>{user.languagesLearning.map(lang => <Badge key={`learn-${lang.language}`}>{t(`languages.${lang.language}`)}</Badge>)}
                      </p>
                    }
                  </Col>

                </Row>

                <Row>
                  <Col xs={12}>
                    <h4>{t('users.edit_details_interests_label')}</h4>
                  </Col>
                  {user.interests.length > 0 &&
                    <Col xs={12} md={6}>
                      <p>
                        <strong>{t('users.edit_details_interests_label')}: </strong>{user.interests.map(interest => {
                          return (
                            <span key={`interest-${interest}`}>{t(`interests.${interest}`)}
                              {user.interests.indexOf(interest) !== user.interests.length - 1 ?
                                <span>,&nbsp;</span> : null
                              }
                            </span>
                          )
                        })}
                      </p>
                    </Col>
                  }
                  {hasLived &&
                    <Col xs={12} md={6}>
                      <p>
                        <strong>{t('users.edit_details_lived_label')}: </strong>{hasLived.map(country => {
                          return (
                            <span key={`lived-${country}`}>{t(`countries.${country}`)}
                              {hasLived.indexOf(country) !== hasLived.length - 1 ?
                                <span>,&nbsp;</span> : null
                              }
                            </span>
                          )
                        })}
                      </p>
                    </Col>
                  }
                  {hasVisited &&
                    <Col xs={12} md={6}>
                      <p>
                        <strong>{t('users.edit_details_visited_label')}: </strong>{hasVisited.map(country => {
                          return (
                            <span key={`visited-${country}`}>{t(`countries.${country}`)}
                              {hasVisited.indexOf(country) !== hasVisited.length - 1 ?
                                <span>,&nbsp;</span> : null
                              }
                            </span>
                          )
                        })}
                      </p>
                    </Col>
                  }
                </Row>

              </div>

            </Grid>
          </span>

        }

      </div>
    )
  }
}

UserProfile.propTypes = {
  auth: PropTypes.object,
  error: PropTypes.object,
  loading: PropTypes.bool,
  user: PropTypes.object,
  t: PropTypes.func,
}
