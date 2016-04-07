var React = require('react');
var ReactDOM = require('react-dom');

var LanguagesContainer = require('./languages-container.react')

var i18n = require('i18n');
var languages = require('languages')

if ($('.language-container--learning').length || $('.language-container--known').length) {
  i18n.loadNamespaces(['languages', 'common'],function(){

    var totalAvailableLanguagesTags = [];
    $.each(languages, function(key) {
      totalAvailableLanguagesTags.push(key)
    })

    ReactDOM.render(
      <LanguagesContainer
        totalAvailableLanguagesTags={totalAvailableLanguagesTags}
        type='learning'
      />, document.querySelector('#language-module-init')
    );


  });
}
