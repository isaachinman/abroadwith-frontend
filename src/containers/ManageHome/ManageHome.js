// Absolute imports
import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { Grid, Row } from 'react-bootstrap'
import { connect } from 'react-redux'

@connect(
  state => ({
    homes: state.privateData.homes,
  }),
)
@translate()
export default class ManageHome extends Component {
  render() {
    const { homes, t } = this.props
    return (
      <Grid>
        <Row>
          <Helmet title={t('manage_home.title')} />
          {Object.keys(homes).map(homeID => <div>{homeID}</div>)}
        </Row>
      </Grid>
    )
  }
}

ManageHome.propTypes = {
  homes: PropTypes.object,
  t: PropTypes.func,
}
