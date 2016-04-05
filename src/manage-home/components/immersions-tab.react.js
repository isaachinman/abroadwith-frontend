var React = require('react');
var ReactDOM = require('react-dom')
var i18n = require('../../global/util/i18n');
var LanguageDropdown = require('./language-dropdown.react');
var toast = require('toast');

var currencies = require('currencies');


module.exports = React.createClass({
  saveImmersions: function() {

    // Create new immersions object
    var newHomeObj = this.props.props;

    if ($('#stay-switch').is(':checked')) {

      // Compile stay object
      newHomeObj.immersions.stay = {
        isActive: true,
        hours: $('#stay-hours').val(),
        languagesOffered: $('#stay-languages-offered').val()
      };

    } else {
      newHomeObj.immersions.stay === null ? newHomeObj.immersions.stay = null : newHomeObj.immersions.stay.isActive = false;
    }

    if ($('#tandem-switch').is(':checked')) {

      // Compile tandem object
      newHomeObj.immersions.tandem = {
        isActive: true,
        hours: $('#tandem-hours').val(),
        languagesOffered: $('#tandem-languages-offered').val(),
      };
      newHomeObj.immersions.tandem.languagesInterested = [];
      $('#tandem-language-interested-chips .chip[data-lang]').each(function() {
        var discount = $('#tandem-discount').val() !== '' ? parseInt($('#tandem-discount').val()) : null;
        newHomeObj.immersions.tandem.languagesInterested.push(
          {
            "lang":$(this).attr('data-lang'),
            "discount":discount
          }
        )
      })

    } else {
      newHomeObj.immersions.tandem === null ? newHomeObj.immersions.tandem = null : newHomeObj.immersions.tandem.isActive = false;
    }

    if ($('#teacher-switch').is(':checked')) {

      // Compile teacher object
      newHomeObj.immersions.teacher = {
        isActive: true,
        packages: $('#packages').val(),
        hourly: parseInt($('#teacher-rate').val()),
        languagesOffered: $('#teacher-languages-offered').val()
      };

    } else {
      newHomeObj.immersions.teacher === null ? newHomeObj.immersions.teacher = null : newHomeObj.immersions.teacher.isActive = false;
    }

    this.props.updateHome(newHomeObj, function() {
      toast('Immersions updated');
    });



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

    // Initial validation
    this.validateStay();
    this.validateTandem();
    this.validateTeacher();

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
  componentWillUnmount: function() {
    $('#teacher-rate').off();
    $('#add-tandem-language').off();
    $('.chip').off();
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

    // Save immersions button
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

      if (languageLearning.val() != '' && $('.chip[data-lang="'+languageCode+'"]').length < 1) {

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

    if (this.props.props.immersions) {

      if (this.props.props.immersions.tandem && typeof this.props.props.immersions.tandem.languagesInterested[0] !== 'undefined') {
        $('#tandem-discount').val(this.props.props.immersions.tandem.languagesInterested[0].discount + '%')
      }
      // Populate stay offered dropdown
      var stayLanguagesOffered = $('#stay-languages-offered');
      stayLanguagesOffered.html('<option value="" disabled>'+i18n.t('immersions:languages_offered_placeholder')+'</option>');
      for (var i=0; i<this.props.props.stayAvailableLanguages.length; i++) {
        stayLanguagesOffered.append("<option value='"+this.props.props.stayAvailableLanguages[i]+"'>"+i18n.t('languages:'+this.props.props.stayAvailableLanguages[i])+"</option>")
      }
      // Populate tandem offered dropdown
      var tandemLanguagesOffered = $('#tandem-languages-offered');
      tandemLanguagesOffered.html('<option value="" disabled>'+i18n.t('immersions:languages_offered_placeholder')+'</option>');
      for (var i=0; i<this.props.props.tandemAvailableLanguages.length; i++) {
        tandemLanguagesOffered.append("<option value='"+this.props.props.tandemAvailableLanguages[i]+"'>"+i18n.t('languages:'+this.props.props.tandemAvailableLanguages[i])+"</option>")
      }
      // Populate tandem learning dropdown
      var tandemLanguagesInterested = $('#tandem-language-sought');
      tandemLanguagesInterested.html('<option value="" disabled>'+i18n.t('immersions:languages_offered_placeholder')+'</option>');
      for (var i=0; i<this.props.props.tandemAvailableLearnLanguages.length; i++) {
        tandemLanguagesInterested.append("<option value='"+this.props.props.tandemAvailableLearnLanguages[i]+"'>"+i18n.t('languages:'+this.props.props.tandemAvailableLearnLanguages[i])+"</option>")
      }
      // Populate teacher offered dropdown
      var teacherLanguagesOffered = $('#teacher-languages-offered');
      teacherLanguagesOffered.html('<option value="" disabled>'+i18n.t('immersions:languages_offered_placeholder')+'</option>');
      for (var i=0; i<this.props.props.teacherAvailableLanguages.length; i++) {
        teacherLanguagesOffered.append("<option value='"+this.props.props.teacherAvailableLanguages[i]+"'>"+i18n.t('languages:'+this.props.props.teacherAvailableLanguages[i])+"</option>")
      }

      if (this.props.props.immersions.stay !== null) {
        stayLanguagesOffered.val(this.props.props.immersions.stay.languagesOffered);
        $('#stay-hours').val(this.props.props.immersions.stay.hours);
        $('input#stay-switch').attr('checked', this.props.props.immersions.stay.isActive);
      }

      // Tandem vars
      if (this.props.props.immersions.tandem !== null) {
        tandemLanguagesOffered.val(this.props.props.immersions.tandem.languagesOffered);
        $('#tandem-hours').val(this.props.props.immersions.tandem.hours);
        $('input#tandem-switch').attr('checked', this.props.props.immersions.tandem.isActive);
      }

      var interestedLanguageChips = [];
      if (this.props.props.immersions.tandem === null || this.props.props.immersions.tandem.length === 0) {
        interestedLanguageChips.push("<div class='chip initial'>"+i18n.t('manage_home:choose_at_least_one_chip')+"<i class='material-icons'>close</i></div>");
      } else {
        $.each(this.props.props.immersions.tandem.languagesInterested, function() {
          interestedLanguageChips.push("<div class='chip language-chip' data-lang="+this.lang+">"+ i18n.t('languages:'+this.lang) +"<i class='material-icons'>close</i></div>");
        })
      }
      $('#tandem-language-interested-chips').html(interestedLanguageChips);

      // Teacher vars
      if (this.props.props.immersions.teacher !== null) {

        teacherLanguagesOffered.val(this.props.props.immersions.teacher.languagesOffered);

        this.props.props.immersions.teacher.hourly !== null ? $('#teacher-rate').val(currencies[this.props.props.pricing.currency] + this.props.props.immersions.teacher.hourly) : null;
        $('#packages').val(this.props.props.immersions.teacher.packages);

        $('input#teacher-switch').attr('checked', this.props.props.immersions.teacher.isActive);

      }

    }

    return (
      <div></div>
    );
  }
});
