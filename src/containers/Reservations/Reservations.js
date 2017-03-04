// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Alert, Button, Col, Grid, Row, Panel } from 'react-bootstrap'
import { BackgroundColorBlock } from 'components'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { loadReservations, approveReservation, declineReservation } from 'redux/modules/privateData/reservations/reservations'
import { Table, Tr, Td } from 'reactable'
import { uiDate } from 'utils/dates'
import { Link } from 'react-router'
import config from 'config'
import Currencies from 'data/constants/Currencies'
import Fees from 'data/constants/Fees'
import FontAwesome from 'react-fontawesome'
import HomestayBookingStatusCodes from 'data/constants/HomestayBookingStatusCodes'
import SpinLoader from 'components/SpinLoader/SpinLoader'

// Relative imports
import styles from './Reservations.styles'

const orderOfPriority = {
  pending: 1,
  approved: 2,
  cancelled: 3,
  declined: 4,
  archived: 5,
}

@connect(
  state => ({
    token: state.auth.token,
    reservations: state.privateData.reservations,
  }),
)
@translate()
export default class Reservations extends Component {

  componentDidMount = () => {
    const { dispatch, token } = this.props
    dispatch(loadReservations(token))
  }

  approveReservation = (reservationID) => {
    const { dispatch, token } = this.props
    dispatch(approveReservation(token, reservationID, true))
  }

  declineReservation = (reservationID) => {
    const { dispatch, token } = this.props
    dispatch(declineReservation(token, reservationID, true))
  }

  render() {

    const { reservations, t } = this.props

    const guestColumnName = t('reservations.sections.guest')
    const statusColumnName = t('reservations.sections.status')
    const locationColumnName = t('reservations.sections.location_details')
    const detailsColumnName = t('reservations.sections.details')

    return (

      <div>
        <Helmet title={t('reservations.title')} />
        <BackgroundColorBlock top color='rgba(0,0,0,.02)' minHeight={360} />
        <Grid>
          <Row style={styles.h1Row}>
            <Col xs={12}>
              <h1>{t('reservations.title')}</h1>
              <h5 className='text-muted'>{t('reservations.subtitle')}</h5>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <SpinLoader show={reservations.loading}>
                <Panel style={styles.mainPanel}>
                  {!reservations.loading && reservations.loaded && reservations.data && reservations.data.length > 0 &&
                    <Table
                      className='table'
                      defaultSort={{ column: statusColumnName, direction: 'asc' }}
                      filterable={[guestColumnName]}
                      filterPlaceholder={t('reservations.search_by_guest_name')}
                      itemsPerPage={5}
                      sortable
                      nextPageLabel={<FontAwesome name='caret-right' />}
                      previousPageLabel={<FontAwesome name='caret-left' />}
                    >
                      {reservations.data.map(reservation => {
                        return (
                          <Tr key={reservation.id} style={styles.tableRow}>
                            <Td column={guestColumnName} value={reservation.guestName}>
                              <div>
                                {reservation.guestId ?
                                  <Link to={`/user/${reservation.guestId}`}>
                                    <img className='reservation-table-guest-img' style={styles.guestPhoto} src={`${config.img}${reservation.guestPhoto ? reservation.guestPhoto : '/users/default.jpg'}`} alt={reservation.guestName} />
                                  </Link>
                                  :
                                  <img className='reservation-table-guest-img' style={styles.guestPhoto} src={`${config.img}${reservation.guestPhoto ? reservation.guestPhoto : '/users/default.jpg'}`} alt={reservation.guestName} />
                                }
                                {reservation.guestId ?
                                  <Link to={`/user/${reservation.guestId}`}>
                                    <div style={styles.guestName}>{reservation.guestName ? <span>{reservation.guestName}</span> : <span>{t('common.deleted_account')}</span>}</div>
                                  </Link>
                                  :
                                  <div style={styles.guestName}>{reservation.guestName ? <span>{reservation.guestName}</span> : <span>{t('common.deleted_account')}</span>}</div>
                                }
                              </div>
                            </Td>
                            <Td className='status-column' column={statusColumnName} value={orderOfPriority[Object.keys(HomestayBookingStatusCodes).filter(statusCategory => HomestayBookingStatusCodes[statusCategory].indexOf(reservation.status) > -1)[0]]}>
                              <div>
                                <div>{t(`reservations.status_codes.${reservation.status}`)}</div>
                              </div>
                            </Td>
                            <Td className='location-column' column={locationColumnName} value={reservation.arrivalDate}>
                              <div>
                                {reservation.roomName &&
                                  <div>{reservation.roomName}</div>
                                }
                                <div>{uiDate(reservation.arrivalDate)} / {uiDate(reservation.departureDate)}</div>
                                <div>{reservation.homeAddress ? <span>{reservation.homeAddress.street}, {reservation.homeAddress.city}</span> : <span>{t('trips.not_applicable')}</span>}</div>
                              </div>
                            </Td>
                            <Td column={detailsColumnName} value={reservation.baseCharges}>
                              <div>
                                {reservation.status === 'PENDING' &&
                                  <Alert style={styles.alert}>
                                    <Button onClick={() => this.approveReservation(reservation.id)} bsSize='xsmall' bsStyle='primary'>{t('trips.actions.approve')}</Button>
                                    &nbsp;{t('common.words.or')}&nbsp;
                                    <Button onClick={() => this.declineReservation(reservation.id)} bsSize='xsmall' bsStyle='danger'>{t('trips.actions.decline')}</Button>
                                  </Alert>
                                }
                                <div>
                                  <Link to={`/reservation/${reservation.id}`}>{t('trips.view_details')}</Link>
                                </div>
                                <div style={styles.marginTop10} className='reservation-more-details'>
                                  <div>
                                    {t('trips.you_will_earn')}: {Currencies[reservation.chargesCurrency]}{(reservation.baseCharges * ((100 - Fees.maximumServiceFee) / 100)).toFixed(2)}
                                  </div>
                                  {t('trips.invoices')}:
                                  {reservation.invoiceIds.length > 0 ? reservation.invoiceIds.map(invoice => {
                                    return (
                                      <Link key={`invoicelink${invoice}`} to={`/invoice/homestay/host/${invoice}`}> {t('trips.invoice')} #{invoice}</Link>
                                    )
                                  }) : <span> {t('trips.not_applicable')}</span>}
                                </div>
                              </div>
                            </Td>
                          </Tr>
                        )
                      })}
                    </Table>
                  }
                  {!reservations.loading && reservations.loaded && reservations.data && reservations.data.length === 0 &&
                    <Alert bsStyle='warning'>
                      {t('trips.no_reservations')}
                    </Alert>
                  }
                </Panel>
              </SpinLoader>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

Reservations.propTypes = {
  dispatch: PropTypes.func,
  reservations: PropTypes.object,
  t: PropTypes.func,
  token: PropTypes.string,
}
