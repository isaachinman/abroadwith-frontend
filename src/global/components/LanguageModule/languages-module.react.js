var React = require('react');
var ReactDOM = require('react-dom');

var JWT = require('JWT');

var LanguageUnit = require('./language-unit.react');

var languageCount = 0;

module.exports = React.createClass({
  getInitialState: function() {

    if (JWT) {
      return {
        languages: []
      }
    } else {
      return {
        languages: [
          {
            id: 'lang'+this.props.type+languageCount,
          }
        ]
      }
    }

  },
  addLanguage: function() {

    var newLanguages = this.state.languages;
    languageCount++
    var newLanguage = {
      id: 'lang'+this.props.type+languageCount
    }
    newLanguages.push(newLanguage);

    this.setState({ languages: newLanguages }, function() {
      this.props.languageChange();
    }.bind(this))
  },
  removeLanguage: function(itemToRemove) {

    var newLanguages = this.state.languages;

    $.each(newLanguages, function(_, language) {
      if (language.id === itemToRemove) {
        language.id = null;
      }
    })

    this.setState({ languages: newLanguages }, function() {
      this.props.languageChange();
    }.bind(this))

  },
  componentDidMount: function() {

    if (typeof this.props.existingLanguages !== 'undefined' && this.props.existingLanguages.length > 0) {

      var newLanguages = this.state.languages;
      var type = this.props.type

      var i=0;
      $.each(this.props.existingLanguages, function(_, language) {
        var addLang = {
          id: 'existing' + type + i++,
          language: language.language,
          level: language.level
        }
        newLanguages.push(addLang)
      })

      this.setState({ languages: newLanguages })
    }

  },
  render: function() {

    var type = this.props.type
    var languages =[];

    // if (typeof this.props.existingLanguages !== 'undefined' && this.props.existingLanguages.length > 0) {
    //   for (var i=0; i<this.props.existingLanguages.length; i++) {
    //     var language = this.props.existingLanguages[i].language;
    //     var level = this.props.existingLanguages[i].level;
    //     var id = type + i;
    //     languages.push(
    //       <LanguageUnit
    //         id={id}
    //         type={type}
    //         currentAvailableLanguageTags={this.props.currentAvailableLanguageTags}
    //         languageChange={this.props.languageChange}
    //         removeLanguage={this.removeLanguage}
    //         language={language}
    //         level={level}
    //       />
    //     )
    //   }
    // }

    $.each(this.state.languages, function(_, language) {
      if (language.id !== null) {
        languages.push(
          <LanguageUnit
            id={language.id}
            language={language.language}
            level={language.level}
            type={type}
            currentAvailableLanguageTags={this.props.currentAvailableLanguageTags}
            languageChange={this.props.languageChange}
            removeLanguage={this.removeLanguage}
          />
        )
      } else {
        languages.push(null)
      }

    }.bind(this))

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
