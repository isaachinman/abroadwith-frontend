var React =  require('react');

module.exports = React.createClass({
  render: function() {
    var { language } = this.props;
    var { level } = this.props;
    return (
      <div className="chip">
        {language}
        {level}
        <i className="material-icons">close</i>
      </div>
    );
  }
});
