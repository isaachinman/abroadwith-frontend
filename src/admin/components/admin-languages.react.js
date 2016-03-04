var React = require('react');
var ReactDOM = require('react-dom');
var i18n = require('../../global/components/i18n');
var processLanguageChips = require('process-language-chips');

var toast = require('toast');

i18n.loadNamespaces(['languages', 'common']);

module.exports = React.createClass({
  saveLanguages: function() {

    // Create new arrays for languages
    var newLanguagesLearning = [];
    var newLanguagesKnown = [];

    $('.language-learning-chip').each(function() {
      newLanguagesLearning.push(
        {
          "language":$(this).attr('data-lang'),
          "level":$(this).attr('data-level')
        }
      )
    })
    $('.language-known-chip').each(function() {
      newLanguagesKnown.push(
        {
          "language":$(this).attr('data-lang'),
          "level":$(this).attr('data-level')
        }
      )
    })

    adminObj.userLearningLanguages = newLanguagesLearning;
    adminObj.userKnownLanguages = newLanguagesKnown;

    this.props.updateAdmin(function() {
      toast('Languages updated');
    });

  },
  componentDidMount: function() {

    $('#add-learning-language').click(processLanguageChips('learning'));
    $('#add-known-language').click(function() {
      processLanguageChips('known');
    });
    $('a#save-languages').click(this.saveLanguages);

  },
  componentDidUpdate: function() {

    $('#language-known-chips div').not('.react').remove();
    $('#language-learning-chips div').not('.react').remove();

    var languagesLearning = [];
    var languagesKnown = [];

    if (this.props.languagesKnown) {

      var languagesKnown = this.props.languagesKnown;

      console.log(languagesKnown)

      var LanguagesKnownContainer = React.createClass({
        render: function() {
          var languagesKnownHTML = []
          languagesKnown.forEach(function(lang) {

            console.log(lang)

            languagesKnownHTML.push(
              <div className="language-known-chip chip" data-lang={lang.language} data-level={lang.level}>{i18n.t('languages:'+lang.language)} ({(i18n.t('common:'+lang.level))})<i className="material-icons">close</i></div>
            )
          })
          console.log(languagesKnownHTML)
          return (
            <div className='react'>{languagesKnownHTML}</div>
          )
        }
      })

      ReactDOM.render(
        <LanguagesKnownContainer />, document.querySelector('#language-known-chips')
      )

    }

    if (this.props.languagesLearning) {

      var languagesLearning = this.props.languagesLearning;

      var LanguagesLearningContainer = React.createClass({
        render: function() {
          var languagesLearningHTML = []
          languagesLearning.forEach(function(lang) {
            languagesLearningHTML.push(
              <div className="language-learning-chip chip" data-lang={lang.lang} data-level={lang.level}>{i18n.t('languages:'+lang.lang)} ({(i18n.t('common:'+'learningLevels.'+lang.level))})<i className="material-icons">close</i></div>
            )
          })
          return (
            <div className='react'>{languagesLearningHTML}</div>
          )
        }
      })

      ReactDOM.render(
        <LanguagesLearningContainer
        />, document.querySelector('#language-learning-chips')
      )
    }

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
