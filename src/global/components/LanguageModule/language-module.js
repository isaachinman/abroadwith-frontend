const React = require('react');
const ReactDOM = require('react-dom');

const JWT = require('JWT');

const LanguagesContainer = require('./languages-container.react')

const i18n = require('i18n');
const languages = require('languages')

if (!JWT) {
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
}
