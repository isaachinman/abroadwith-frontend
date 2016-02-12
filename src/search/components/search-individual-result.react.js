var React = require('react');

module.exports = React.createClass({
  mapHover: function(id) {

    if (typeof markers !== 'undefined') {
      markers[id].labelClass = 'map-marker-label--hovered';
      markers[id].label.setStyles();
      markers[id].label.draw();
      markers[id].setZIndex(9999);
    }

  },
  mapOut: function(id) {

    if (typeof markers !== 'undefined') {
      markers[id].labelClass = 'map-marker-label';
      markers[id].label.setStyles();
      markers[id].label.draw();
      markers[id].setZIndex(1);
    }

  },
  handleClick: function() {},
  render: function() {

    // Room photo src
    var roomSrc = 'https://img.abroadwith.com' + this.props.roomPhoto;

    // Home photos
    if (this.props.homePhotos) {
      var homePhotos = [];
      this.props.homePhotos.forEach(function(src) {
        var src = 'https://img.abroadwith.com' + src;
        var photo = <div className="Wallop-item"><img src={src}/></div>
        homePhotos.push(photo);
      })
    }

    // Host photo src
    var hostImg = {
      backgroundImage: 'url(https://img.abroadwith.com' + this.props.hostPhoto + ')'
    }

    // If host's name ends with an s, don't put an s after apostrophe
    if (this.props.host.slice(-1) == 's') {
      var hostName = this.props.host + "' ";
    } else {
      var hostName = this.props.host + "'s ";
    }

    // Compile immersion tags
    var immersionTags = [];
    this.props.immersions.forEach(function(immersion) {
      var tag = <div className={immersion}>{immersion}</div>
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

    return (

      <div className='col s12 m12 l6'>
        <div className='search-result' onMouseOver={this.mapHover.bind(this, this.props.markerId)} onMouseOut={this.mapOut.bind(this, this.props.markerId)}>
          <a className='overlay' href='/home'></a>
          <div className="wallop">
            <div className="Wallop-list">
              <div className="Wallop-item Wallop-item--current"><img src={roomSrc}/></div>
              {homePhotos}
            </div>
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
            <span>€{this.props.price}</span>
            <div className='course-added'>
              <i className="fa fa-map-marker"></i>{this.props.courseCount}
              courses
            </div>
          </div>
          <div className='info'>
            <div className='title'>
              {hostName}
              home
              <div className='subtitle'>
                {this.props.homeType}
                <i className="fa fa-angle-right"></i>
                Kreuzberg
              </div>
            </div>
            <div className='rating'>
              <div className='count'>
                {this.props.reviewCount}
                reviews
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
