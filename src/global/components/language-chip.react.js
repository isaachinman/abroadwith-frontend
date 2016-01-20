require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="language chip" data-lang={this.props.language} data-lang-level={this.props.level}>
        {this.props.language} ({this.props.level})
        <i className="material-icons">close</i>
        <input name={this.props.language} defaultValue={this.props.level}></input>
      </div>
    );
  }
});
