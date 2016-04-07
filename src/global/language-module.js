var React = require('react');
var ReactDOM = require('react-dom');
var i18n = require('.../../util/i18n');

var LanguagesContainer = require('./languages-container.react')
var LanguagesModule = require('./languages-module.react');


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
