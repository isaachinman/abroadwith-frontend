const React = require('react');
const ReactDOM = require('react-dom');

const VerificationsContainer = require('./verifications-container.react')

const i18n = require('i18n');

module.exports = function(destinationUrl) {
  if ($('.verifications-module').length) {
    i18n.loadNamespaces(['common', 'countries'],function(){

      $('.verifications-module').each(function() {

        ReactDOM.render(
          <VerificationsContainer
            destinationUrl={destinationUrl}
          />, this
        );

      })
    })
  }
}
