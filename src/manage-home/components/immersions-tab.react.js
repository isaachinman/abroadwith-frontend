const React = require('react');
const ReactDOM = require('react-dom');

const JWT = require('JWT')
const domains = require('domains')

require('wnumb')

const noUiSlider = require('no-ui-slider')
const select2 = require('select2-browserify')

var Dropzone = require('dropzone')
Dropzone.autoDiscover = false

const i18n = require('i18n')
const LanguageDropdown = require('./language-dropdown.react')
const toast = require('toast')

const currencies = require('currencies');


module.exports = React.createClass({
  saveImmersions: function() {

    // Create new immersions object
    var newHomeObj = this.props.props;

    // Compile stay object
    newHomeObj.immersions.stay = {
      isActive: $('.card-reveal.stay').is(':visible'),
      hours: $('#stay-hours').val() !== null ? $('#stay-hours').val() : null,
      languagesOffered: $('#stay-languages-offered').val() !== null ? $('#stay-languages-offered').val() : []
    };

    // Compile tandem object
    newHomeObj.immersions.tandem = {
      isActive: $('.card-reveal.tandem').is(':visible'),
      hours: $('#tandem-hours').val() !== null ? $('#tandem-hours').val() : null,
      languagesOffered: $('#tandem-languages-offered').val() !== null ? $('#tandem-languages-offered').val() : [],
      languagesInterested: $('#tandem-language-sought').val() !== null ? $('#tandem-language-sought').val() : [],
    };

    // Compile teacher object
    newHomeObj.immersions.teacher = {
      isActive: $('.card-reveal.teacher').is(':visible'),
      packages: $('#packages').val() !== null ? $('#packages').val() : null,
      hourly: $('#teacher-rate').val() !== null ? parseInt(($('#teacher-rate').val()).replace(/[^0-9\.]+/g,"")) : null,
      languagesOffered: $('#teacher-languages-offered').val() !== null ? $('#teacher-languages-offered').val() : []
    };

    // Validate stay object
    $.each(newHomeObj.immersions.stay, function(key, value) {
      if (value === null) {
        newHomeObj.immersions.stay.isActive = false;
      }
    })

    // Validate tandem object
    $.each(newHomeObj.immersions.tandem, function(key, value) {
      if (value === null) {
        newHomeObj.immersions.tandem.isActive = false;
      }
    })

    // Validate teacher object
    $.each(newHomeObj.immersions.teacher, function(key, value) {
      if (value === null) {
        newHomeObj.immersions.teacher.isActive = false;
      }
    })

    // Apply discount to each tandem language
    if (newHomeObj.immersions.tandem !== null && $('#tandem-language-sought').val() !== null) {

      newHomeObj.immersions.tandem.languagesInterested = [];

      var tandemLanguages = $('#tandem-language-sought').val();
      var discount = parseInt(tandemDiscount.noUiSlider.get());

      for (var i=0; i<tandemLanguages.length; i++) {
        newHomeObj.immersions.tandem.languagesInterested.push(
          {
            lang: tandemLanguages[i],
            discount: discount
          }
        )
      }
    }

    if (newHomeObj.immersions.stay !== null && newHomeObj.immersions.tandem !== null && newHomeObj.immersions.teacher !== null && newHomeObj.immersions.stay.isActive === false && newHomeObj.immersions.tandem.isActive === false && newHomeObj.immersions.teacher.isActive === false) {

      // No immersions are active
      return

    } else {

      this.props.updateHome(newHomeObj, function() {
        toast(i18n.t('manage_home:immersions_updated_toast'));
      });

    }

  },
  componentDidUpdate: function() {

    tandemDiscount.noUiSlider.set(this.props.props.immersions.tandem && this.props.props.immersions.tandem.languagesInterested.length > 0 ? this.props.props.immersions.tandem.languagesInterested[0].discount : 20)

    $.each(this.props.props.immersions, function(index, obj) {
      if (obj && obj.isActive === true) {
        $('.card-reveal.'+index).parent().css('overflow', 'hidden');
        $('.card-reveal.'+index).find('select').attr('required','required');
        $('.card-reveal.'+index).find('#teacher-rate').length > 0 ? $('#teacher-rate').attr('required','required') : null;
        $('.card-reveal.'+index).find('select').css({
          display: "block",
          height: '1px',
          padding: 0,
          width: '1px',
          opacity: 0,
          border: 0,
          position: 'absolute'
        });
        $('.card-reveal.'+index).css({ display: 'block'}).velocity("stop", false).velocity({translateY: '-100%'}, {duration: 300, queue: false, easing: 'easeInOutQuad'});
        setTimeout(function() {
          $('.card-reveal.'+index).parent().css({ overflow: 'visible'})
        }, 300)
        $('#save-immersions').removeClass('disabled')
      }
    })

  },
  componentWillUnmount: function() {
    $('#teacher-rate').off();
    $('#add-tandem-language').off();
    $('.chip').off();
  },
  componentDidMount: function() {

    // Set to window for later usage
    window.tandemDiscount = document.getElementById('tandem-discount')

    // Init certificate language selection
    $('#new-certificate-language').select2({
      placeholder: 'Language of certification',
      maxFiles: 1
    })

    // Init certificate dropzone
    var certificateDropzone = new Dropzone('#new-certificate-image', {
      url: '/upload/users/'+JWT.rid+'/certificates',
      autoProcessQueue: false,
      method: 'post',
      headers: {'abroadauth': 'Bearer ' + localStorage.getItem('JWT')},
      addRemoveLinks: true,
      maxFilesize: 10,
      dictDefaultMessage: i18n.t('common:drop_files_here'),
      dictRemoveFile: i18n.t('manage_home:delete'),
      acceptedFiles: 'image/jpeg,image/png',
      init: function() {
        this.on("processing", function(file) {
          this.options.url = '/upload/users/'+JWT.rid+'/certificates'
        });
        this.on('success', function(x, serverResponse) {
          console.log(serverResponse)
        })
      }
    })

    // Not done yet
    $('form#create-new-certificate').submit(function(e) {
      e.preventDefault()
      certificateDropzone.processQueue()
      var newCertificate = {
        name: e.target[0].value,
        language: $('#new-certificate-language').find('option:selected').attr('data-lang')
      }
      if (newCertificate.language == undefined || certificateDropzone.files.length < 1) {
        $('#certificate-modal').find('.modal-failure').show()
      }
      console.log(newCertificate)
    })

    // Init nouislider
    noUiSlider.create(tandemDiscount, {
    	start: [20],
    	range: {
    		'min': 0,
    		'max': 95
    	},
      step: 5,
      tooltips: true,
      format: wNumb({
        decimals:0,
        postfix: '%'
      })
    });

    // Save immersions button
    $('form#home-immersions-form').submit(function(e) {
      e.preventDefault();
      this.saveImmersions();
    }.bind(this));

    $('.activator').click(function() {
      var target = $(this).attr('data-target');
      $('.card-reveal.'+target).find('select').attr('required','required');
      $('.card-reveal.'+target).find('#teacher-rate').length > 0 ? $('#teacher-rate').attr('required','required') : null;
      $('.card-reveal.'+target).find('select').css({
        display: "block",
        height: '1px',
        padding: 0,
        width: '1px',
        opacity: 0,
        border: 0,
        position: 'absolute'
      });

      $('#save-immersions').removeClass('disabled');

    })

    $('i.disable').click(function() {

      var target = $(this).attr('data-target');
      $('.card-reveal.'+target).find('select').attr('required',false);
      $('.card-reveal.'+target).find('#teacher-rate').length > 0 ? $('#teacher-rate').attr('required', false) : null;

      if ($('.card-reveal').find('select:required').length === 0) {
        $('#save-immersions').addClass('disabled')
      }

    })

  },
  render: function() {

    if (this.props.props.immersions) {

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
      }

      // Tandem vars
      if (this.props.props.immersions.tandem !== null) {

        var tandemLanguages = [];
        $.each(this.props.props.immersions.tandem.languagesInterested, function(index, obj) {
          tandemLanguages.push(obj.lang);
        })

        tandemLanguagesOffered.val(this.props.props.immersions.tandem.languagesOffered);
        tandemLanguagesInterested.val(tandemLanguages);
        $('#tandem-hours').val(this.props.props.immersions.tandem.hours);

      }

      // Teacher vars
      if (this.props.props.immersions.teacher !== null) {

        teacherLanguagesOffered.val(this.props.props.immersions.teacher.languagesOffered);

        this.props.props.immersions.teacher.hourly !== null ? $('#teacher-rate').val(this.props.props.immersions.teacher.hourly) : null;
        $('#packages').val(this.props.props.immersions.teacher.packages);

      }

    }

    return (
      <div></div>
    );
  }
});
