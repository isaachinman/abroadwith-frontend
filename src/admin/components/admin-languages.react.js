var React = require('react');
var ReactDOM = require('react-dom');
var i18n = require('../../global/components/i18n');

i18n.loadNamespaces(['languages', 'common']);

module.exports = React.createClass({
  saveLanguages: function() {

    console.log('click')

    // Create new arrays for languages
    var newLanguagesLearning = [];
    var newLanguagesKnown = [];

    $('.language-learning-chip').each(function() {
      newLanguagesLearning.push(
        {
          "lang":$(this).attr('data-lang'),
          "level":$(this).attr('data-level')
        }
      )
    })
    $('.language-known-chip').each(function() {
      newLanguagesKnown.push(
        {
          "lang":$(this).attr('data-lang'),
          "level":$(this).attr('data-level')
        }
      )
    })

    adminObj.userLearningLanguages = newLanguagesLearning;
    adminObj.userKnownLanguages = newLanguagesKnown;

    this.props.updateAdmin();

  },
  componentDidMount: function() {
    $('a#save-languages').click(this.saveLanguages);
  },
  componentDidUpdate: function() {

    var languagesLearning = [];
    var languagesKnown = [];

    if (this.props.languagesKnown) {

      var languagesKnown = this.props.languagesKnown;

      var LanguagesKnownContainer = React.createClass({
        render: function() {
          var languagesKnownHTML = []
          languagesKnown.forEach(function(lang) {

            languagesKnownHTML.push(
              <div className="language-known-chip chip" data-lang={lang.lang} data-level={lang.level}>{i18n.t('languages:'+lang.lang)} ({(i18n.t('common:'+'knownLevels.'+lang.level))})<i className="material-icons">close</i></div>
            )
          })
          return (
            <div>{languagesKnownHTML}</div>
          )
        }
      })

      ReactDOM.render(
        <LanguagesKnownContainer
        />, document.querySelector('#language-known-chips')
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
            <div>{languagesLearningHTML}</div>
          )
        }
      })

      ReactDOM.render(
        <LanguagesLearningContainer
        />, document.querySelector('#language-learning-chips')
      )

      ReactDOM.render(
        <LanguagesKnownContainer
        />, document.querySelector('#language-known-chips')
      )
    }

  },
  render: function() {

    return (
      <div></div>
    );
  }
});
