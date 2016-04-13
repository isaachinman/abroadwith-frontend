var React = require('react');
var ReactDOM = require('react-dom');

var VerificationsContainer = require('./verifications-container.react')

var i18n = require('i18n');

module.exports = function() {
  if ($('.verifications-module').length) {
    i18n.loadNamespaces(['common'],function(){

      $('.verifications-module').each(function() {

        ReactDOM.render(
          <VerificationsContainer
          />, this
        );

      })
    })
  }
}
