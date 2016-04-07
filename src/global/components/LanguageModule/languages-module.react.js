var React = require('react');
var ReactDOM = require('react-dom');

var LanguageUnit = require('./language-unit.react');

var languageCount = 0;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      languages: [
        'lang'+this.props.type+languageCount
      ]
    }
  },
  addLanguage: function() {

    var newLanguages = this.state.languages;
    languageCount++
    newLanguages.push('lang'+this.props.type+languageCount);

    this.setState({
      languages: newLanguages
    })
  },
  removeLanguage: function(itemToRemove) {

    var newLanguages = this.state.languages;

    for (var i=0; i<newLanguages.length; i++) {
      newLanguages[i] == itemToRemove ? newLanguages[i] = null : null;
    }

    this.setState({ languages: newLanguages }, function() {
      this.props.languageChange();
    }.bind(this))



  },
  componentDidMount: function() {
    $('select.language-module-select2').select2();
  },
  render: function() {

    var type = this.props.type
    var languages =[];

    for (var i=0; i<this.state.languages.length; i++) {
      if (this.state.languages[i] !== null) {
        languages.push(
          <LanguageUnit
            id={this.state.languages[i]}
            type={type}
            currentAvailableLanguageTags={this.props.currentAvailableLanguageTags}
            languageChange={this.props.languageChange}
            removeLanguage={this.removeLanguage}
          />
        )
      } else {
        languages.push(null)
      }
    }

    return (
      <div>

        {languages}

        <div className='col s12 margin-top-10'>
          <a className='add-language' onClick={this.addLanguage}>Add another language</a>
        </div>

      </div>
    );
  }
});
