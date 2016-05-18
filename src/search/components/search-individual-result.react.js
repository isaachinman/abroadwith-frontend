var React = require('react');

var domains = require('domains');
var currencies = require('currencies');

var i18n = require('../../global/util/i18n');

module.exports = React.createClass({
  mapHover: function(id) {

    if (typeof markers !== 'undefined' && markers.length !== 0) {
      markers[id].labelClass = 'map-marker-label--hovered';
      markers[id].label.setStyles();
      markers[id].label.draw();
      markers[id].setZIndex(9999);
    }

  },
  mapOut: function(id) {

    if (typeof markers !== 'undefined' && markers.length !== 0) {
      markers[id].labelClass = 'map-marker-label';
      markers[id].label.setStyles();
      markers[id].label.draw();
      markers[id].setZIndex(1);
    }

  },
  render: function() {

    // Slider Id
    var sliderId = 'slider' + this.props.markerId;

    // Home photos
    if (this.props.homePhotos) {
      var homePhotos = [];
      this.props.homePhotos.forEach(function(src) {
        var src = domains.IMG + src + '?h=300&auto=compress';
        var photo = <div className="Wallop-item"><img alt={this.props.host} src={src}/></div>
        homePhotos.push(photo);
      }.bind(this))
    }

    // Compile room and home photos
    var photos = [];
    var host = this.props.host;
    if (this.props.roomPhoto !== undefined) {

      var homePhotos = [];
      this.props.homePhotos.forEach(function(src) {
        var src = domains.IMG + src + '?h=300&auto=compress';
        var photo = <div className="Wallop-item"><img alt={host} data-src={src}/></div>
        homePhotos.push(photo);
      })

      photos.push(
        <div className="Wallop-list">
          <div className="Wallop-item Wallop-item--current">
            <img src={domains.IMG + this.props.roomPhoto + '?h=300&auto=compress'}/>
          </div>
          {homePhotos}
        </div>
      )

    } else {

      var homePhotos = [];
      var counter = 0;
      this.props.homePhotos.forEach(function(src) {
        var src = domains.IMG + src + '?h=300&auto=compress';
        counter++
        if (counter === 1) {
          var photo = <div className="Wallop-item"><img alt={host} src={src}/></div>
        } else {
          var photo = <div className="Wallop-item"><img alt={host} data-src={src}/></div>
        }
        homePhotos.push(photo);
      })

      photos.push(
        <div className="Wallop-list">
          {homePhotos}
        </div>
      )

    }

    // Host photo src
    var hostImg = {
      backgroundImage: this.props.hostPhoto !== undefined ? 'url(' + domains.IMG + this.props.hostPhoto + '?w=120&auto=compress' + ')' : 'url(' + domains.IMG + '/users/default.jpg' + '?w=120&auto=compress' + ')'
    }

    // Compile immersion tags
    var immersionTags = [];
    this.props.immersions.forEach(function(immersion) {
      var tag = <div className={immersion}>{i18n.t('common:'+immersion)}</div>
      immersionTags.push(tag);
    })

    // Compile stars for rating
    var rating = (Math.round(this.props.rating * 2) / 2).toFixed(1);
    var stars = [];
    var starRemainder = Math.floor(5 - rating);
    while (rating > 0) {
      if (rating >= 1) {
        stars.push( < i className = "fa fa-star" > </i>)
      } else if (rating == 0.5) {
        stars.push( < i className = "fa fa-star-half-o" > </i>)
      }
      rating--;
    }
    while (starRemainder > 0) {
      stars.push( < i className = "fa fa-star-o" > </i>)
      starRemainder--;
    }

    var domId = "result-" + this.props.markerId

    var homelink = '/homestay/'+this.props.homeId+this.props.query;
    return (

      <div className='col s12 m12 l6'>
        <div className='search-result' id={domId} onMouseOver={this.mapHover.bind(this, this.props.markerId)} onMouseOut={this.mapOut.bind(this, this.props.markerId)}>
          <a className='overlay' href={homelink}></a>
          <div className="wallop">
            {photos}
            <a className="Wallop-buttonPrevious white-text">
              <i className="fa fa-chevron-circle-left fa-2x"></i>
            </a>
            <a className="Wallop-buttonNext white-text">
              <i className="fa fa-chevron-circle-right fa-2x"></i>
            </a>
          </div>
          <div className='tag'>
            {immersionTags}
          </div>
          <div className='price'>
            <span>{currencies[this.props.currency]}{this.props.price}</span>
            <div className='course-added'>
              <i className="fa fa-map-marker"></i>{this.props.courseCount}
              {i18n.t('common:words.courses')}
            </div>
          </div>
          <div className='info'>
            <div className='title'>

              {i18n.t('common:home_of', {first_name: this.props.host})}

              <div className='subtitle'>
                {i18n.t('homes:home_types.'+this.props.homeType)}
                <i className="fa fa-angle-right"></i>
                {this.props.neighbourhood}
              </div>
            </div>
            <div className='rating'>
              <div className='count'>
                {this.props.reviewCount}&nbsp;{i18n.t('common:reviews')}
              </div>
              <div className='stars'>
                {stars}
              </div>
            </div>
          </div>
          <div className='host' style={hostImg}></div>
        </div>
      </div>

    );
  }
});
