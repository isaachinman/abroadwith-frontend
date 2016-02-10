var React = require('react');

module.exports = React.createClass({
  handleClick: function() {

  },
  render: function() {

    var roomSrc = 'https://img.abroadwith.com' + this.props.roomPhoto;

    var hostImg = {
      backgroundImage: 'url(https://img.abroadwith.com' + this.props.hostPhoto + ')'
    }

    if (this.props.host.slice(-1) == 's') {
      var hostName = this.props.host + "'";
    } else {
      var hostName = this.props.host + "'s";
    }

    var immersionTags = [];

    this.props.immersions.forEach(function(immersion) {
      var tag = <div className={immersion}>{immersion}</div>
      immersionTags.push(tag);
    })


    var rating = (Math.round(this.props.rating * 2) / 2).toFixed(1);
    var stars = [];
    var starRemainder = Math.floor(5 - rating);

    while (rating > 0) {
      if (rating >= 1) {
        stars.push(<i className="fa fa-star"></i>)
      } else if (rating == 0.5) {
        stars.push(<i className="fa fa-star-half-o"></i>)
      }
      rating--;
    }

    while (starRemainder > 0) {
      stars.push(<i className="fa fa-star-o"></i>)
      starRemainder--;
    }

    return (

      <div className='col s12 m12 l6'>
        <div className='search-result'>
          <a className='overlay' href='/home'></a>
          <div className="wallop">
            <div className="Wallop-list">
              <div className="Wallop-item Wallop-item--current"><img src={roomSrc}/></div>
              <div className="Wallop-item"><img src="http://lorempixel.com/800/400/food/1"/></div>
            </div>
            <a className="Wallop-buttonPrevious white-text"><i className="fa fa-chevron-circle-left fa-2x"></i></a>
            <a className="Wallop-buttonNext white-text"><i className="fa fa-chevron-circle-right fa-2x"></i></a>
          </div>
          <div className='tag'>
            {immersionTags}
          </div>
          <div className='price'>
            <span>€{this.props.price}</span>
            <div className='course-added'>
              <i className="fa fa-map-marker"></i>{this.props.courseCount} courses
            </div>
          </div>
          <div className='info'>
            <div className='title'>
                {hostName} home
              <div className='subtitle'>
                {this.props.homeType} <i className="fa fa-angle-right"></i> Kreuzberg
              </div>
            </div>
            <div className='rating'>
              <div className='count'>
                {this.props.reviewCount} reviews
              </div>
              <div className='stars'>
                {stars}
              </div>
            </div>
          </div>
          <div className='host' style={hostImg}>
          </div>
        </div>
      </div>

    );
  }
});
