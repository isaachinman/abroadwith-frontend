var React = require('react');
var i18n = require('../../global/components/i18n');
var room = require('../../global/constants/Room');


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
