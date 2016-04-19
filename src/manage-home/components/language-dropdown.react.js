const React = require('react');
const i18n = require('i18n');


module.exports = React.createClass({

  render: function() {

    var languages = [];
    this.props.languages.forEach(function(lang) {
      languages.push(
        <option value={lang}>i18n.t('languages:'+languageLearning.val().toLowerCase())</option>
      )
    })

    return (

      <select id={this.props.id} class='material' multiple>

        <option value="" disabled></option>
        {languages}

      </select>

    );
  }
});
