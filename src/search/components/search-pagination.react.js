var React = require('react');

module.exports = React.createClass({
  componentDidUpdate: function() {

    var activePage = Math.ceil(this.props.pageOffset/this.props.pageSize)

    // Give active class to current page
    $('ul#pagination').find('li.active').removeClass('active')
    $('ul#pagination .page-btn:nth-child(' + ((this.props.pageOffset/10)+2) + ')').addClass('active')

    // Remove previous event listener
    $('li.prev').off()
    $('li.next').off()

    // Upon clicking previous, go to previous page
    $('li.prev').click(function() {
      handleChange(undefined, (activePage-1))
    })

    // Upon clicking next, go to next page
    $('li.next').click(function() {
      handleChange(undefined, (activePage+1))
    })

  },
  render: function() {

    var resultCount = this.props.numberOfResults;
    var pageSize = this.props.pageSize;
    var pageOffset = this.props.pageOffset;
    var totalPages = Math.ceil(resultCount/pageSize);

    var activePage = Math.ceil(pageOffset/pageSize)+1;

    var pages = [];

    for (var i=1; i<=totalPages; i++) {

      var id = 'page-'+i
      var isHidden = {}

      // If page is 5 or under, hide all above
      console.log(activePage)
      if (activePage <= 5 && i > 5) {
        isHidden.display = 'none'
      } else if (activePage > 5) {
        if (i > activePage + 2 || i < activePage - 2) {
          isHidden.display = 'none'
        }
      }

      var newPage = <li id={id} data-page={i} style={isHidden} className='page-btn' onClick={handleChange.bind(this, undefined, (i-1))}><a>{i}</a></li>

      pages.push(newPage);
    }

    // Compile styling for prev and next buttons
    var hidePrevNextBtns = {}
    var prevBtnClasses = ['prev']
    var nextBtnClasses = ['next']

    // Only show next/prev if more than 5 pages
    if (totalPages < 5) {
      hidePrevNext = { display:'none' }
    }

    // If active page is page 1, disable prev button
    if (activePage === 1) {
      prevBtnClasses.push('disabled')
    }

    // If active page is the last page, disable next button
    if (activePage === totalPages) {
      nextBtnClasses.push('disabled')
    }

    prevBtnClasses = prevBtnClasses.join(' ')
    nextBtnClasses = nextBtnClasses.join(' ')

    $('.page-btn').click(function() {
      $('.page-btn').removeClass('active');
      $(this).addClass('active');
    })

    return (

      <div className='center-align'>
        <ul id='pagination' className="pagination">
          <li style={hidePrevNextBtns} className={prevBtnClasses}><a><i className="fa fa-angle-left" aria-hidden="true"></i></a></li>
          {pages}
          <li style={hidePrevNextBtns} className={nextBtnClasses}><a><i className="fa fa-angle-right" aria-hidden="true"></i></a></li>
        </ul>
      </div>

    );
  }
});
