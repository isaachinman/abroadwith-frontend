// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, Fade, Grid, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Checkbox from 'antd/lib/checkbox'
import { clearRoomSearchAdditionalFilters, performRoomSearch } from 'redux/modules/ui/search/homestaySearch'
import HomeData from 'data/constants/HomeData'
import Radium from 'radium'
import { push } from 'react-router-redux'
import Slider from 'rc-slider'
import { sunsetOrange } from 'styles/colors'
import { translate } from 'react-i18next'

// Styles
const styles = {
  filtersPanelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 'calc(100vh - 80px)',
    overflow: 'scroll',
    zIndex: 105,
    pointerEvents: 'none',
  },
  moreFiltersPanel: {
    background: 'white',
    width: '100%',
  },
  closeFiltersPanelBtn: {
    zIndex: 9,
    cursor: 'pointer',
    position: 'absolute',
    fontSize: 40,
    top: 20,
    right: 40,
    '@media (max-width: 400px)': {
      top: 15,
      right: 15,
    },
  },
  contentContainer: {
    padding: '0 40px 50px 40px',
    '@media (max-width: 400px)': {
      padding: '0 0 50px 0',
    },
  },
  categoryRow: {
    paddingBottom: 30,
    position: 'relative',
  },
  borderBottom: {
    position: 'absolute',
    left: 15,
    bottom: 0,
    background: '#ddd',
    width: 'calc(100% - 30px)',
    height: 1,
  },
  bottomRow: {
    marginTop: 50,
  },
  clearAllFilters: {
    display: 'inline-block',
    verticalAlign: 'bottom',
    margin: '5px 15px',
  },
}

@connect(
  state => ({
    homestaySearch: state.uiPersist.homestaySearch,
  })
)
@translate()
@Radium
export default class FiltersPanel extends Component {

  state = {
    filters: this.props.homestaySearch.params.filters || [],
    otherParams: {
      homeType: null,
    },
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.homestaySearch.params.filters) {
      this.setState({ filters: nextProps.homestaySearch.params.filters })
    }
  }

  clearFilters = () => {
    const { dispatch, homestaySearch } = this.props
    dispatch(clearRoomSearchAdditionalFilters(homestaySearch.params, push))
    this.props.handleClose()
  }

  handleSearch = () => {
    const { dispatch, homestaySearch } = this.props
    dispatch(performRoomSearch(Object.assign({}, homestaySearch.params, {
      homeType: this.state.otherParams.homeType,
      filters: this.state.filters,
    }), push))
    this.props.handleClose()
  }

  handleChange = (value, field) => {

    if (typeof field === 'string') {

      this.setState({ otherParams: Object.assign({}, this.state.otherParams, { [field]: value }) })

    } else if (Number.isInteger(value) && value >= 50) {

      // Special case for weird meal plan slider thing
      let newFilters = this.state.filters.filter(filter => filter !== 'FULL_BOARD' && filter !== 'HALF_BOARD')
      if (value === 50) {
        newFilters = newFilters.concat(['HALF_BOARD'])
      } else if (value === 100) {
        newFilters = newFilters.concat(['FULL_BOARD'])
      }
      this.setState({ filters: newFilters })

    } else if (Number.isInteger(value) && value === 0) {

      this.setState({ filters: this.state.filters.filter(filter => filter !== 'HALF_BOARD' && filter !== 'FULL_BOARD') })

    } else if (value.constructor === Array) {

      // Checkboxes all share one array of values
      this.setState({
        filters: value,
      })

    }

  }

  render() {

    const { filters, otherParams } = this.state
    const { handleClose, open, t } = this.props

    let mealPlanValue = 0
    if (filters.includes('HALF_BOARD')) {
      mealPlanValue = 50
    } else if (filters.includes('FULL_BOARD')) {
      mealPlanValue = 100
    }

    return (
      <div style={open ? Object.assign({}, styles.filtersPanelContainer, { pointerEvents: 'all' }) : styles.filtersPanelContainer}>
        <Fade
          in={open}
          style={styles.moreFiltersPanel}
        >
          <div>
            <div
              className='text-muted'
              onClick={handleClose}
              style={styles.closeFiltersPanelBtn}
            >
              &times;
            </div>
            <Grid>

              <div style={styles.contentContainer}>
                <Row>
                  <Col xs={12}>
                    <h3 className='header-green'>{t('search.more_filters')}</h3>
                  </Col>
                </Row>

                <Row style={styles.categoryRow}>
                  <Col xs={12}>
                    <h5>{t('homes.meal_plan')}</h5>
                  </Col>
                  <Col xs={10} sm={12} md={6} style={{ paddingBottom: 20 }}>
                    <Slider
                      onChange={this.handleChange}
                      min={-10}
                      marks={{ 0: t('search.meal_choice.breakfast'), 50: t('search.meal_choice.half_board'), 100: t('search.meal_choice.full_board') }}
                      step={null}
                      value={mealPlanValue}
                    />
                  </Col>
                  <div style={styles.borderBottom} />
                </Row>

                <Row style={styles.categoryRow}>
                  <Col xs={12}>
                    <h5>{t('homes.home_types_label')}</h5>
                  </Col>
                  <Col xs={12}>
                    <Checkbox.Group
                      value={otherParams.homeType}
                      onChange={value => this.handleChange(value, 'homeType')}
                      options={HomeData.homeTypes.map(homeType => ({
                        value: homeType,
                        label: t(`homes.home_types.${homeType}`),
                      }))}
                    />
                  </Col>
                  <div style={styles.borderBottom} />
                </Row>

                <Row style={styles.categoryRow}>
                  <Col xs={12}>
                    <h5>{t('homes.amenities_label')}</h5>
                  </Col>
                  <Col xs={12}>
                    <Checkbox.Group
                      value={filters}
                      onChange={this.handleChange}
                      options={HomeData.homeSettings.AMENITIES.map(amenity => ({
                        value: amenity,
                        label: t(`homes.amenities.${amenity}`),
                      }))}
                    />
                  </Col>
                  <div style={styles.borderBottom} />
                </Row>

                <Row style={styles.categoryRow}>
                  <Col xs={12}>
                    <h5>{t('search.lifestyle_label')}</h5>
                  </Col>
                  <Col xs={12}>
                    <Checkbox.Group
                      value={filters}
                      onChange={this.handleChange}
                      options={HomeData.homeSettings.PREFERENCES.map(preference => ({
                        value: preference,
                        label: t(`homes.preferences.${preference}`),
                      }))}
                    />
                  </Col>
                  <div style={styles.borderBottom} />
                </Row>

                <Row style={styles.categoryRow}>
                  <Col xs={12}>
                    <h5>{t('homes.diets_offered_label')}</h5>
                  </Col>
                  <Col xs={12}>
                    <Checkbox.Group
                      value={filters}
                      onChange={this.handleChange}
                      options={HomeData.homeServices.FOOD_OPTION.map(foodOption => ({
                        value: foodOption,
                        label: t(`homes.diets_offered.${foodOption}`),
                      }))}
                    />
                  </Col>
                  <div style={styles.borderBottom} />
                </Row>

                <Row style={styles.categoryRow}>
                  <Col xs={12}>
                    <h5>{t('homes.extras_label')}</h5>
                  </Col>
                  <Col xs={12}>
                    <Checkbox.Group
                      value={filters}
                      onChange={this.handleChange}
                      options={HomeData.homeServices.GENERAL.filter(service => service !== 'EXTRA_GUEST').map(service => ({
                        value: service,
                        label: t(`homes.extras.${service}`),
                      }))}
                    />
                  </Col>
                  <div style={styles.borderBottom} />
                </Row>

                <Row style={styles.bottomRow}>
                  <Col xs={12}>
                    <Button onClick={this.handleSearch} bsSize='large' bsStyle='primary'>{t('common.search')}</Button>
                    <div style={styles.clearAllFilters}>
                      {t('common.words.or')} <a onClick={this.clearFilters} style={{ color: sunsetOrange }}>{t('search.clear_all_filters')}</a>
                    </div>
                  </Col>
                </Row>
              </div>

            </Grid>
          </div>
        </Fade>
      </div>
    )
  }
}

FiltersPanel.propTypes = {
  dispatch: PropTypes.func,
  handleClose: PropTypes.func,
  homestaySearch: PropTypes.object,
  open: PropTypes.bool,
  t: PropTypes.func,
}
