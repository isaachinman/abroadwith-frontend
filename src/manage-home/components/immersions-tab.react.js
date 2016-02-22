var React = require('react');
var ReactDOM = require('react-dom')
var i18n = require('../../global/components/i18n');
var LanguageDropdown = require('./language-dropdown.react');

i18n.loadNamespaces(['languages','manage_home']);

module.exports = React.createClass({
  saveImmersions: function() {

    // Only proceed if at least one immersion is turned on
    if ($('.immersion-switch:checked').length > 0) {

      // Create new immersions object
      var newImmersionsObj = {};

      if ($('#stay-switch').is(':checked')) {

        // Compile stay object
        newImmersionsObj.stay = {};
        newImmersionsObj.stay.hours = $('#stay-hours').val();
        newImmersionsObj.stay.languagesOffered = $('#stay-languages-offered').val();

      }

      if ($('#tandem-switch').is(':checked')) {

        // Compile tandem object
        newImmersionsObj.tandem = {};
        newImmersionsObj.tandem.hours = $('#tandem-hours').val();
        newImmersionsObj.tandem.languagesOffered = $('#tandem-languages-offered').val();
        newImmersionsObj.tandem.languagesInterested = [];
        $('#language-chips .chip[data-lang]').each(function() {
          newImmersionsObj.tandem.languagesInterested.push($(this).attr('data-lang'))
        })

      }

      if ($('#teacher-switch').is(':checked')) {

        // Compile teacher object
        newImmersionsObj.teacher = {};
        newImmersionsObj.teacher.packages = $('#packages').val();
        newImmersionsObj.teacher.materials = $('#material-costs').val();
        newImmersionsObj.teacher.languagesOffered = $('#teacher-languages-offered').val();

      }

      // Modify home object, using new immersions object
      if (typeof homeObj !== 'undefined') {
        homeObj.immersions = newImmersionsObj;

        // POST new home object
        Materialize.toast('Immersions updated', 4000);
      }

    }

  },
  componentDidMount: function() {

    // Language-known select
    $('select#tandem-language-sought').select2({
      placeholder: i18n.t('immersions:languages_interested_placeholder')
    });

    // Set permanent vars
    var addLanguage = $('a#add-tandem-language');
    var chipContainer = $('#tandem-language-interested-chips');
    var languageLearning = $('#tandem-language-sought');

    addLanguage.click(function() {

      // Set conditional vars
      var languageCode = $('#tandem-language-sought option:selected').attr('data-lang');

      if (languageLearning.val() != '' && $('.chip[data-lang="'+languageCode+'"]').length <= 0) {

        // Remove initial chip
        if ($('#tandem-language-interested-chips').find($('.initial').length)) {
          $('#tandem-language-interested-chips').find($('.initial')).remove();
        }

        var newLanguage = '<div class="language-chip chip" data-lang="' + languageCode + '">' + i18n.t('languages:'+languageLearning.val()) + '<i class="material-icons">close</i></div>'
        chipContainer.append(newLanguage);

        languageLearning.select2('val', '');
        languageLearning.val('');

      }
    })

  },
  render: function() {

    // Populate language selects

    //
    // tandem-languages-offered
    // tandem-language-sought
    //
    // teacher-languages-offered

    if (this.props.immersions) {

      console.log(this.props.immersions)

      // Stay vars
      if (this.props.immersions.stay) {

        // Populate stay offered dropdown
        var stayLanguagesOffered = $('#stay-languages-offered');
        var trueStayLangs = [];
        $.each(this.props.immersions.stay.languagesOffered, function(lang, offered) {
          if (offered === true) {
            trueStayLangs.push(lang)
          }
          stayLanguagesOffered.append("<option value='"+lang+"'>"+i18n.t('languages:'+lang.toLowerCase())+"</option>")
        });

        stayLanguagesOffered.val(trueStayLangs);

        $('#stay-hours').val(this.props.immersions.stay.hours);

      }

      // Tandem vars
      if (this.props.immersions.tandem) {

        // Populate tandem offered dropdown
        var tandemLanguagesOffered = $('#tandem-languages-offered');
        var trueTandemOfferedLangs = [];
        $.each(this.props.immersions.tandem.languagesOffered, function(lang, offered) {
          if (offered === true) {
            trueTandemOfferedLangs.push(lang)
          }
          tandemLanguagesOffered.append("<option value='"+lang+"'>"+i18n.t('languages:'+lang.toLowerCase())+"</option>")
        });
        tandemLanguagesOffered.val(trueTandemOfferedLangs);

        $('#tandem-hours').val(this.props.immersions.tandem.hours);

        // Populate tandem offered dropdown
        var tandemLanguagesInterested = $('#tandem-language-sought');
        $.each(this.props.immersions.tandem.languagesInterested, function(lang, offered) {
          console.log(lang)
          tandemLanguagesInterested.append("<option value='"+lang+"'>"+i18n.t('languages:'+lang.toLowerCase())+"</option>")
        });
      }

      var interestedLanguageChips = [];
      if (typeof tandemLanguagesInterested === 'undefined') {
        interestedLanguageChips.push("<div class='chip initial'>"+i18n.t('manage_home:choose_at_least_one_chip')+"<i class='material-icons'>close</i></div>");
      } else {
        $.each(this.props.immersions.tandem.languagesInterested, function(lang, offered) {
          interestedLanguageChips.push("<div class='chip' data-lang="+lang+">"+ i18n.t('languages:'+lang.toLowerCase()) +"<i class='material-icons'>close</i></div>");
        })
      }
      $('#tandem-language-interested-chips').append(interestedLanguageChips);

      // Teacher vars
      if (this.props.immersions.teacher) {

        // Populate tandem offered dropdown
        var teacherLanguagesOffered = $('#teacher-languages-offered');
        var trueTeacherOfferedLangs = [];
        $.each(this.props.immersions.teacher.languagesOffered, function(lang, offered) {
          if (offered === true) {
            trueTeacherOfferedLangs.push(lang)
          }
          teacherLanguagesOffered.append("<option value='"+lang+"'>"+i18n.t('languages:'+lang.toLowerCase())+"</option>")
        });
        teacherLanguagesOffered.val(trueTeacherOfferedLangs);

        $('#teacher-rate').val(this.props.immersions.teacher.hourly + this.props.currency);
        $('#packages').val(this.props.immersions.teacher.packages);
        $('#material-costs').val(this.props.immersions.teacher.materials + this.props.currency);
        $('#teacher-languages-offered').val(this.props.immersions.teacher.languagesOffered);

      }

    }

    $('a#save-immersions').click(this.saveImmersions)

    return (
      <div></div>
    );
  }
});
