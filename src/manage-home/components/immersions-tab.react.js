var React = require('react');
var ReactDOM = require('react-dom')
var i18n = require('../../global/components/i18n');
var LanguageDropdown = require('./language-dropdown.react');
var toast = require('toast');


module.exports = React.createClass({
  saveImmersions: function() {

    // Create new immersions object
    var newImmersionsObj = homeObj.immersions;

    if ($('#stay-switch').is(':checked')) {

      // Compile stay object
      newImmersionsObj.stay = {};
      newImmersionsObj.stay.isActive = true;
      newImmersionsObj.stay.hours = $('#stay-hours').val();
      newImmersionsObj.stay.languagesOffered = $('#stay-languages-offered').val();

    } else {
      newImmersionsObj.stay === null ? newImmersionsObj.stay = null : newImmersionsObj.stay.isActive = false;
    }

    if ($('#tandem-switch').is(':checked')) {

      // Compile tandem object
      newImmersionsObj.tandem = {};
      newImmersionsObj.tandem.isActive = true;
      newImmersionsObj.tandem.hours = $('#tandem-hours').val();
      newImmersionsObj.tandem.languagesOffered = $('#tandem-languages-offered').val();
      newImmersionsObj.tandem.languagesInterested = [];
      $('#tandem-language-interested-chips .chip[data-lang]').each(function() {
        var discount = $('#tandem-discount').val() !== '' ? parseInt($('#tandem-discount').val()) : null;
        newImmersionsObj.tandem.languagesInterested.push(
          {
            "lang":$(this).attr('data-lang'),
            "discount":discount
          }
        )
      })

    } else {
      newImmersionsObj.tandem === null ? newImmersionsObj.tandem = null : newImmersionsObj.tandem.isActive = false;
    }

    if ($('#teacher-switch').is(':checked')) {

      // Compile teacher object
      newImmersionsObj.teacher = {};
      newImmersionsObj.teacher.isActive = true;
      newImmersionsObj.teacher.packages = $('#packages').val();
      newImmersionsObj.teacher.hourly = parseInt($('#teacher-rate').val());
      newImmersionsObj.teacher.languagesOffered = $('#teacher-languages-offered').val();

    } else {
      newImmersionsObj.teacher === null ? newImmersionsObj.teacher = null : newImmersionsObj.teacher.isActive = false;
    }

    // Modify home object, using new immersions object
    if (typeof homeObj !== 'undefined') {

      homeObj.immersions = newImmersionsObj;

      console.log(newImmersionsObj)

      this.props.updateHome(function() {
        toast('Immersions updated');
      });

    }

  },
  validateStay: function() {
    if ($('#stay-hours').val() !== null && $('#stay-languages-offered').val() !== null) {
      $('#stay-switch').attr('disabled', false);
    } else {
      $('#stay-switch').attr('disabled', true);
      $('#stay-switch').attr('checked', false);
    }
  },
  validateTandem: function() {
    if ($('#tandem-hours').val() !== null && $('#tandem-languages-offered').val() !== null && $('#tandem-language-interested-chips').find('.language-chip').length > 0) {
      $('#tandem-switch').attr('disabled', false);
    } else {
      $('#tandem-switch').attr('disabled', true);
      $('#tandem-switch').attr('checked', false);
    }
  },
  validateTeacher: function() {
    if ($('#packages').val() !== null && $('#teacher-rate').val() !== null && $('#teacher-rate').val() !== '' && $('#teacher-languages-offered').val() !== null) {
      $('#teacher-switch').attr('disabled', false);
    } else {
      $('#teacher-switch').attr('disabled', true);
      $('#teacher-switch').attr('checked', false);
    }
  },
  componentDidUpdate: function() {
    $('#teacher-rate').keyup(function() {
      this.validateTeacher();
    }.bind(this));
    $('#add-tandem-language').click(function() {
      this.validateTandem()
    }.bind(this));
    $('.chip').click(function() {
      this.validateTandem();
    }.bind(this));
  },
  componentDidMount: function() {
    // Validate stay immersion
    $('#stay-hours').change(this.validateStay);
    $('#stay-languages-offered').change(this.validateStay);

    // Validate tandem immersion
    var validateTandem = this.validateTandem;
    $('#tandem-hours').change(validateTandem);
    $('#tandem-languages-offered').change(validateTandem);


    // Validate teacher immersion
    $('#packages').change(this.validateTeacher);
    $('#teacher-languages-offered').change(this.validateTeacher);

    $('a#save-immersions').click(this.saveImmersions);

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
      var languageCode = $('#tandem-language-sought option:selected').val();

      if (languageLearning.val() != '' && $('.chip[data-lang="'+languageCode+'"]').length <= 0) {

        // Remove initial chip
        if ($('#tandem-language-interested-chips').find($('.initial').length)) {
          $('#tandem-language-interested-chips').find($('.initial')).remove();
        }

        var newLanguage = '<div class="language-chip chip" data-lang="' + languageCode + '">' + i18n.t('languages:'+languageLearning.val()) + '<i class="material-icons">close</i></div>'
        chipContainer.append(newLanguage);

      }
    })

  },
  render: function() {

    if (this.props.immersions) {

      if (this.props.immersions.tandem) {
        $('#tandem-discount').val(this.props.immersions.tandem.languagesInterested[0].discount + '%')
      }
      // Populate stay offered dropdown
      var stayLanguagesOffered = $('#stay-languages-offered');
      stayLanguagesOffered.html('<option value="" disabled>'+i18n.t('immersions:languages_offered_placeholder')+'</option>');
      for (var i=0; i<this.props.stayAvailableLanguages.length; i++) {
        stayLanguagesOffered.append("<option value='"+this.props.stayAvailableLanguages[i]+"'>"+i18n.t('languages:'+this.props.stayAvailableLanguages[i])+"</option>")
      }
      // Populate tandem offered dropdown
      var tandemLanguagesOffered = $('#tandem-languages-offered');
      tandemLanguagesOffered.html('<option value="" disabled>'+i18n.t('immersions:languages_offered_placeholder')+'</option>');
      for (var i=0; i<this.props.tandemAvailableLanguages.length; i++) {
        tandemLanguagesOffered.append("<option value='"+this.props.tandemAvailableLanguages[i]+"'>"+i18n.t('languages:'+this.props.tandemAvailableLanguages[i])+"</option>")
      }
      // Populate tandem learning dropdown
      var tandemLanguagesInterested = $('#tandem-language-sought');
      tandemLanguagesInterested.html('<option value="" disabled>'+i18n.t('immersions:languages_offered_placeholder')+'</option>');
      for (var i=0; i<this.props.tandemAvailableLearnLanguages.length; i++) {
        tandemLanguagesInterested.append("<option value='"+this.props.tandemAvailableLearnLanguages[i]+"'>"+i18n.t('languages:'+this.props.tandemAvailableLearnLanguages[i])+"</option>")
      }
      // Populate teacher offered dropdown
      var teacherLanguagesOffered = $('#teacher-languages-offered');
      teacherLanguagesOffered.html('<option value="" disabled>'+i18n.t('immersions:languages_offered_placeholder')+'</option>');
      for (var i=0; i<this.props.teacherAvailableLanguages.length; i++) {
        teacherLanguagesOffered.append("<option value='"+this.props.teacherAvailableLanguages[i]+"'>"+i18n.t('languages:'+this.props.teacherAvailableLanguages[i])+"</option>")
      }

      if (this.props.immersions.stay !== null) {
        stayLanguagesOffered.val(this.props.immersions.stay.languagesOffered);
        $('#stay-hours').val(this.props.immersions.stay.hours);
        $('input#stay-switch').attr('checked', this.props.immersions.stay.isActive);
      }

      // Tandem vars
      if (this.props.immersions.tandem !== null) {
        tandemLanguagesOffered.val(this.props.immersions.tandem.languagesOffered);
        $('#tandem-hours').val(this.props.immersions.tandem.hours);
        $('input#tandem-switch').attr('checked', this.props.immersions.tandem.isActive);
      }

      var interestedLanguageChips = [];
      if (this.props.immersions.tandem === null || this.props.immersions.tandem.length === 0) {
        interestedLanguageChips.push("<div class='chip initial'>"+i18n.t('manage_home:choose_at_least_one_chip')+"<i class='material-icons'>close</i></div>");
      } else {
        $.each(this.props.immersions.tandem.languagesInterested, function() {
          interestedLanguageChips.push("<div class='chip' data-lang="+this.lang+">"+ i18n.t('languages:'+this.lang) +"<i class='material-icons'>close</i></div>");
        })
      }
      $('#tandem-language-interested-chips').html(interestedLanguageChips);

      // Teacher vars
      if (this.props.immersions.teacher !== null) {

        teacherLanguagesOffered.val(this.props.immersions.teacher.languagesOffered);

        this.props.immersions.teacher.hourly !== null ? $('#teacher-rate').val(this.props.immersions.teacher.hourly + this.props.currency) : null;
        $('#packages').val(this.props.immersions.teacher.packages);
        $('#material-costs').val(this.props.immersions.teacher.materials + this.props.currency);

        $('input#teacher-switch').attr('checked', this.props.immersions.teacher.isActive);

      }

    }

    return (
      <div></div>
    );
  }
});
