require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="language chip" data-lang={this.props.language} data-lang-level={this.props.level}>
        {i18n.t('languages:'+this.props.language)} ({(i18n.t('users:language_levels.'+this.props.level))})
        <i className="material-icons">close</i>
      </div>
    );
  }
});
