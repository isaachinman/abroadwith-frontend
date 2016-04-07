var React = require('react');
var ReactDOM = require('react-dom');

var LanguagesModule = require('./languages-module.react');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      currentAvailableLanguageTags: this.props.totalAvailableLanguagesTags
    }
  },
  languageChange: function() {

    var usedLanguages = [];

    $('select.language').each(function() {
      this.value !== '' ? usedLanguages.push(this.value) : null;
    })

    var newAvailableTags = $(this.props.totalAvailableLanguagesTags).not(usedLanguages).get();

    this.setState({
      currentAvailableLanguageTags: newAvailableTags
    })

  },
  render: function() {

    console.log(this.props.totalAvailableLanguagesTags)

    var currentAvailableLanguageTags = this.state.currentAvailableLanguageTags;
    var languageChange = this.languageChange;

    $('.language-container--learning').each(function() {
      ReactDOM.render(
        <LanguagesModule
          type='learning'
          currentAvailableLanguageTags={currentAvailableLanguageTags}
          languageChange={languageChange}
        />, this
      );
    })

    $('.language-container--known').each(function() {
      ReactDOM.render(
        <LanguagesModule
          type='known'
          currentAvailableLanguageTags={currentAvailableLanguageTags}
          languageChange={languageChange}
        />, this
      );
    })

    return (
      <div></div>
    );
  }
});
