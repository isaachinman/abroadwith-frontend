var React = require('react');

module.exports = React.createClass({
  componentDidUpdate: function() {
    $('ul#pagination').find('li.active').removeClass('active')
    $('ul#pagination li:nth-child(' + ((this.props.pageOffset/10)+1) + ')').addClass('active');
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
      var newPage = <li id={id} data-page={i} className='page-btn' onClick={handleChange.bind(this, undefined, (i-1))}><a>{i}</a></li>
      pages.push(newPage);
    }

    $('.page-btn').click(function() {
      $('.page-btn').removeClass('active');
      $(this).addClass('active');
    })

    return (

      <div className='center-align'>
        <ul id='pagination' className="pagination">
          {pages}
        </ul>
      </div>

    );
  }
});
