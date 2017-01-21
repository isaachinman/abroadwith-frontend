// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, Grid, Row, Panel } from 'react-bootstrap'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { loadReservations } from 'redux/modules/privateData/reservations/reservations'
import { Table, Tr, Td } from 'reactable'
import { uiDate } from 'utils/dates'
import { Link } from 'react-router'
import config from 'config'
import Currencies from 'data/constants/Currencies'
import Fees from 'data/constants/Fees'
import FontAwesome from 'react-fontawesome'
import SpinLoader from 'components/SpinLoader/SpinLoader'

// Relative imports
import styles from './Reservations.styles'

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

  render() {

    const { reservations, t } = this.props

    const guestColumnName = t('reservations.sections.guest')
    const statusColumnName = t('reservations.sections.status')
    const locationColumnName = t('reservations.sections.location_details')
    const detailsColumnName = t('reservations.sections.details')

    return (

      <div>
        <Helmet title={t('reservations.title')} />
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
                  <Table
                    className='table'
                    filterable={[guestColumnName]}
                    filterPlaceholder={t('reservations.search_by_guest_name')}
                    itemsPerPage={5}
                    sortable
                    nextPageLabel={<FontAwesome name='caret-right' />}
                    previousPageLabel={<FontAwesome name='caret-left' />}
                  >
                    {reservations.data.map(reservation => {
                      return (
                        <Tr key={reservation.id}>
                          <Td column={guestColumnName} value={reservation.guestName}>
                            <div>
                              <img className='reservation-table-guest-img' style={styles.guestPhoto} src={`${config.img}${reservation.guestPhoto ? reservation.guestPhoto : '/users/default.jpg'}`} alt={reservation.guestName} />
                              <div style={styles.guestName}>{reservation.guestName ? <span>{reservation.guestName}</span> : <span>{t('common.deleted_account')}</span>}</div>
                            </div>
                          </Td>
                          <Td className='status-column' column={statusColumnName} value={reservation.status}>
                            <div>
                              <div>{t(`reservations.status_codes.${reservation.status}`)}</div>
                            </div>
                          </Td>
                          <Td className='location-column' column={locationColumnName} value={reservation.arrivalDate}>
                            <div>
                              <div>{uiDate(reservation.arrivalDate)} / {uiDate(reservation.departureDate)}</div>
                              <div>{reservation.homeAddress ? <span>{reservation.homeAddress.street}, {reservation.homeAddress.city}</span> : <span>{t('trips.not_applicable')}</span>}</div>
                            </div>
                          </Td>
                          <Td column={detailsColumnName} value={reservation.baseCharges}>
                            <div>
                              <Link to={`/reservation/${reservation.id}`}>
                                <Button bsSize='xsmall'>{t('trips.view_details')}</Button>
                              </Link>
                              <div className='reservation-more-details' style={styles.invoiceList}>
                                <div>
                                  {t('trips.you_will_earn')}: {Currencies[reservation.chargesCurrency]}{(reservation.baseCharges * ((100 - Fees.maximumServiceFee) / 100)).toFixed(2)}
                                </div>
                                {t('trips.invoices')}:
                                {reservation.invoiceIds.length > 0 ? reservation.invoiceIds.map(invoice => {
                                  return (
                                    <Link key={`invoicelink${invoice}`} to={`/invoice/${invoice}`}> {t('trips.invoice')} #{invoice}</Link>
                                  )
                                }) : <span> {t('trips.not_applicable')}</span>}
                              </div>
                            </div>
                          </Td>
                        </Tr>
                      )
                    })}
                  </Table>
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
