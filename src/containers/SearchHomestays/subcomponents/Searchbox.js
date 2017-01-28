// Absolute imports
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { translate } from 'react-i18next'
import FontAwesome from 'react-fontawesome'

// Relative imports
import styles from '../SearchHomestays.styles'

@translate()
export default class Searchbox extends Component {

  componentDidMount() {
    console.log('search is mounting', this)
    const input = ReactDOM.findDOMNode(this.refs.input) // eslint-disable-line
    this.searchBox = new google.maps.places.SearchBox(input) // eslint-disable-line
    this.searchBox.addListener('places_changed', this.onPlacesChanged)
  }

  componentWillUnmount() {
    if (typeof this.searchBox.removeListener === 'function') {
      console.log('removing event listener')
      this.searchBox.removeListener('places_changed', this.onPlacesChanged)
    }
  }

  onPlacesChanged = () => {
    this.props.handleSearchboxChange(this.searchBox.getPlaces()[0])
  }

  /* eslint-disable */
  render() {

    const { t } = this.props

    return (
      <div className='form-group-sm'>
        <FontAwesome name='search' style={styles.searchIcon} />
        <input style={styles.searchBox} placeholder={t('search.map_input_placeholder')} ref='input' type='text' className='form-control' />
      </div>
    )
  }
  /* eslint-enable */

}

Searchbox.propTypes = {
  handleSearchboxChange: PropTypes.func,
  t: PropTypes.func,
}
