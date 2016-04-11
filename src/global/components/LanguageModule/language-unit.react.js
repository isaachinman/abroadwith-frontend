var React = require('react');
var ReactDOM = require('react-dom');
var i18n = require('i18n');

module.exports = React.createClass({
  removeLanguage: function() {
    var id = this.props.id;
    this.props.removeLanguage(id)
  },
  componentDidMount: function() {

    if (typeof this.props.language !== 'undefined') {
      $('#'+this.props.id+' select.language').val(this.props.language)
    }

    if (typeof this.props.level !== 'undefined') {
      $('#'+this.props.id+' .material').val(this.props.level)
    }

    $('#'+this.props.id+' .select2').select2({
      dropdownParent: $('body')
    });

    $('#'+this.props.id+' .select2').change(function() {
      $('#'+this.props.id+' select.language').attr('data-lang',($('#'+this.props.id+' select.language').val()));
      this.props.languageChange();
    }.bind(this));

    $('#'+this.props.id+' .material').material_select();

  },
  render: function() {

    var languageOptionTags = [];

    for (var i=0; i<this.props.currentAvailableLanguageTags.length; i++) {
      languageOptionTags.push(
        <option value={this.props.currentAvailableLanguageTags[i]}>{i18n.t('languages:'+this.props.currentAvailableLanguageTags[i])}</option>
      )
    }

    var levelOptionTags = [];
    if (this.props.type === 'learning') {
      // Compile learning levels
      levelOptionTags.push(<option selected value='BEGINNER'>{i18n.t('common:learningLevels.BEGINNER')}</option>)
      levelOptionTags.push(<option value='INTERMEDIATE'>{i18n.t('common:learningLevels.INTERMEDIATE')}</option>)
      levelOptionTags.push(<option value='ADVANCED'>{i18n.t('common:learningLevels.ADVANCED')}</option>)
    } else {
      // Compile known levels
      levelOptionTags.push(<option selected value='NATIVE'>{i18n.t('common:knownLevels.NATIVE')}</option>)
      levelOptionTags.push(<option value='PROFICIENT'>{i18n.t('common:knownLevels.PROFICIENT')}</option>)
    }

    return (

      <div className='col s12 m10 offset-m1 l8 offset-l2'>
        <div id={this.props.id} className='language-module'>
          <select className='select2 language' data-placeholder={i18n.t('common:choose_language')} data-lang={this.props.language}>
            <option></option>
            {languageOptionTags}
          </select>
          <select className="material language-level">
            {levelOptionTags}
          </select>
          <a className='delete' onClick={this.removeLanguage}><i className="fa fa-times-circle"></i></a>
        </div>
      </div>

    );
  }
});
