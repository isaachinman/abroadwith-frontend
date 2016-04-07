var React = require('react');
var ReactDOM = require('react-dom');
var i18n = require('../../global/util/i18n');

var LanguagesModule = require('languages-module');

var languages = require('languages')

var toast = require('toast');

module.exports = React.createClass({
  saveLanguages: function() {

    // Create new arrays for languages
    var newLanguagesLearning = [];
    var newLanguagesKnown = [];

    // Get native languages
    $('.language-container--known .language-module').each(function() {

      var language = $(this).find('select.language').attr('data-lang');
      var level = $(this).find('select.language-level').val();

      if (language != undefined && level != undefined) {
        newLanguagesKnown.push({
          "language": $(this).find('select.language').attr('data-lang'),
          "level": $(this).find('select.language-level').val()
        });
      }

    })

    // Get learning languages
    $('.language-container--learning .language-module').each(function() {

      var language = $(this).find('select.language').attr('data-lang');
      var level = $(this).find('select.language-level').val();

      if (language != undefined && level != undefined) {
        newLanguagesLearning.push({
          "language": $(this).find('select.language').attr('data-lang'),
          "level": $(this).find('select.language-level').val()
        });
      }

    })

    if (newLanguagesKnown.length < 1) {
      $('#languages-not-valid').removeClass('hide');
      return;
    }

    adminObj.userLearningLanguages = newLanguagesLearning;
    adminObj.userKnownLanguages = newLanguagesKnown;

    this.props.updateAdmin(function() {
      toast('Languages updated');
    });

  },
  componentDidMount: function() {
    $('a#save-languages').click(this.saveLanguages);
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
  componentDidUpdate: function() {

    var totalAvailableLanguagesTags = [];
    $.each(languages, function(key) {
      totalAvailableLanguagesTags.push(key)
    })

    var knownLanguages = this.props.languagesKnown;
    var learningLanguages = this.props.languagesLearning;

    var languageChange = this.languageChange;

    $('.language-container--learning').each(function() {
      ReactDOM.render(
        <LanguagesModule
          type='learning'
          currentAvailableLanguageTags={totalAvailableLanguagesTags}
          languageChange={languageChange}
          existingLanguages={learningLanguages}
        />, this
      );
    })

    $('.language-container--known').each(function() {
      ReactDOM.render(
        <LanguagesModule
          type='known'
          currentAvailableLanguageTags={totalAvailableLanguagesTags}
          languageChange={languageChange}
          existingLanguages={knownLanguages}
        />, this
      );
    })

    languageChange();

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
