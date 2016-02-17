var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  render: function() {

    var languagesLearning = [];
    var languagesKnown = [];

    if (this.props.languagesKnown) {

      var languagesKnown = this.props.paymentMethods;

      var LanguagesKnownContainer = React.createClass({
        render: function() {
          var languagesKnownHTML = []
          languagesKnown.forEach(function(lang) {

            var code = lang.lang;
            var translatedLanguage = $('.language-select').find(code).html();


            languagesKnownHTML.push(
              <div className="language-known-chip chip" data-lang=lang.lang data-level=lang.level>lang.name (lang.level)<i className="material-icons">close</i></div>
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

      var languagesLearning = this.props.paymentMethods;

      var LanguagesLearningContainer = React.createClass({
        render: function() {
          var languagesLearningHTML = []
          languagesKnown.forEach(function(lang) {
            languagesKnownHTML.push(
              <div className="language-known-chip chip" data-lang=lang.lang data-level=lang.level>lang.name (lang.level)<i className="material-icons">close</i></div>
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



    return (
      <div></div>
    );
  }
});
