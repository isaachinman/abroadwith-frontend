const React = require('react');
const ReactDOM = require('react-dom');

const LanguagesModule = require('./languages-module.react');

const JWT = require('JWT');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      currentAvailableLanguageTags: this.props.totalAvailableLanguagesTags
    }
  },
  languageChange: function() {

    var usedLanguages = [];

    $('select.language').each(function() {
      $(this).attr('data-lang') !== undefined ? usedLanguages.push($(this).attr('data-lang')) : null;
    })

    $('select.language option').attr('disabled', false)

    for (var i=0; i<usedLanguages.length; i++) {
      $('select.language option[value='+usedLanguages[i]+']').attr('disabled', 'disabled');
    }


  },
  render: function() {

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
