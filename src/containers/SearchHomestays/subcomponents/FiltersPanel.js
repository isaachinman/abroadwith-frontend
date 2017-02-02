// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Checkbox from 'antd/lib/checkbox'
import { Button, Col, Fade, Grid, Row } from 'react-bootstrap'
import HomeData from 'data/constants/HomeData'
import Radium from 'radium'
import Slider from 'rc-slider'
import { translate } from 'react-i18next'

// Styles
const styles = {
  filtersPanelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 'calc(100vh - 80px)',
    overflow: 'scroll',
    zIndex: 99,
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
}

@connect(
  state => ({
    roomHovered: state.ui.hoverables.roomHovered,
  })
)
@translate()
@Radium
export default class FiltersPanel extends Component {

  render() {

    const { handleClose, open, t } = this.props

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
                      min={-10}
                      marks={{ 0: 'Breakfast', 50: 'Breakfast & Dinner', 100: 'Breakfast, Lunch, & Dinner' }}
                      step={null}
                      defaultValue={20}
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
                      options={HomeData.homeServices.FOOD_OPTION.map(foodOption => ({
                        value: foodOption,
                        label: t(`homes.diets_offered.${foodOption}`),
                      }))}
                    />
                  </Col>
                  <div style={styles.borderBottom} />
                </Row>

                <Row style={styles.bottomRow}>
                  <Col xs={12}>
                    <Button bsSize='large' bsStyle='primary'>Search</Button>
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
  open: PropTypes.bool,
  t: PropTypes.func,
}
