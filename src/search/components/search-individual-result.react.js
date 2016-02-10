var React = require('react');

module.exports = React.createClass({
  handleClick: function() {

  },
  render: function() {
    return (

      <div className='col s12 m12 l6'>
        <div className='search-result'>
          <a className='overlay' href='/home'></a>
          <div className="wallop">
            <div className="Wallop-list">
              <div className="Wallop-item Wallop-item--current"><img src="http://lorempixel.com/800/400/food/1"/></div>
              <div className="Wallop-item"><img src="http://lorempixel.com/800/400/food/2"/></div>
              <div className="Wallop-item"><img src="http://lorempixel.com/800/400/food/3"/></div>
              <div className="Wallop-item"><img src="http://lorempixel.com/800/400/food/4"/></div>
            </div>
            <a className="Wallop-buttonPrevious white-text"><i className="fa fa-chevron-circle-left fa-2x"></i></a>
            <a className="Wallop-buttonNext white-text"><i className="fa fa-chevron-circle-right fa-2x"></i></a>
          </div>
          <div className='tag'>
            <div className='stay'>
              Stay
            </div>
            <div className='tandem'>
              Tandem
            </div>
            <div className='teacher'>
              Teacher
            </div>
          </div>
          <div className='price'>
            <span>€1245</span>
            <div className='course-added'>
              <i className="fa fa-map-marker"></i>3 courses
            </div>
          </div>
          <div className='info'>
            <div className='title'>
              Joses home
              <div className='subtitle'>
                Cabin <i className="fa fa-angle-right"></i> Kreuzberg
              </div>
            </div>
            <div className='rating'>
              <div className='count'>
                22 reviews
              </div>
              <div className='stars'>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star-o"></i>
                <i className="fa fa-star-o"></i>
              </div>
            </div>
          </div>
          <div className='host'>
          </div>
        </div>
      </div>

    );
  }
});
