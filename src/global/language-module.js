const React = require('react');
const ReactDOM = require('react-dom');
const i18n = require('.../../util/i18n');

const LanguagesContainer = require('./languages-container.react')
const LanguagesModule = require('./languages-module.react');


if ($('.language-container--learning').length || $('.language-container--known').length) {
  i18n.loadNamespaces(['languages', 'common'],function(){
    ReactDOM.render(
      <LanguagesContainer
        type='learning'
      />, document.querySelector('body')
    );
  });
}



$('.language-container--learning').each(function() {
  ReactDOM.render(
    <LanguagesModule
      type='learning'
    />, this
  );
})

$('.language-container--known').each(function() {
  ReactDOM.render(
    <LanguagesModule
      type='known'
    />, this
  );
})
