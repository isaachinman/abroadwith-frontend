var React = require('react');

module.exports = React.createClass({
  render: function() {

    var resultCount = this.props.numberOfResults;
    var pageSize = this.props.pageSize;
    var pageOffset = this.props.pageOffset;
    var totalPages = Math.ceil(resultCount/pageSize);

    var activePage = Math.ceil(pageOffset/pageSize)+1;

    console.log(activePage)

    var pageContainer = $('ul#pagination');

    for (var i=1; i<=totalPages; i++) {
      var newPage = "<li id='page-" + i + "' data-page='" + i + "' class='page-btn'><a href='#!'>" + i + "</a></li>"
      pageContainer.append(newPage);
    }

    $('.page-btn').click(function() {
      $('.page-btn').removeClass('active');
      $(this).addClass('active');
    })

    pageContainer.find('li:nth-child(' + activePage + ')').addClass('active');
    console.log(totalPages);

    return (

      <div className='center-align'>
        <ul id='pagination' className="pagination">
        </ul>
      </div>

    );
  }
});
