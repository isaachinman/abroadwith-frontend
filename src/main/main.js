const Wallop = require('wallop');
const newMessageThread = require('new-message-thread');
const refreshToken = require('refresh-token');

const jwt_decode = require('jwt-decode')

const validateBookNowButtons = require('validate-book-now-buttons');
const validateMessageButtons = require('validate-message-buttons');
validateBookNowButtons();
validateMessageButtons();

const apiDate = require('api-date');
const uiDate = require('ui-date');
const pikaday = require('pikaday');
const select2 = require('select2-browserify');

const i18n = require('i18n');

// Initialisations
$(document).ready(function() {

  if ($('#email-verified-successfully').length) {
    refreshToken(function() {
      var JWT = jwt_decode(localStorage.getItem('JWT'))
      $('.profile-link').attr('href', ('/users/'+JWT.rid))
    });
  }

  if ($('form.create-new-message-thread').length) {
    $('form.create-new-message-thread').submit(function(e) {
      e.preventDefault()
      newMessageThread()
    })
  }

  if ($('#hero-search').length) {

    $(window).width() < 601 ? $('#location').attr('placeholder', i18n.t('common:where_mobile')) : null;

    $('#hero-search').click(function() {

      var language = $('#language option:selected').val() !== '' ? '&language=' + $('#language option:selected').attr('data-lang') : '';
      var location = $('#location').val() !== '' ? '&location_string=' + ($('#location').val()).replace(/ /g,"_") : '';
      var arrival = $('#arrival').val() !== '' ? '&arrival=' + apiDate($('#arrival').val()) : '';
      var departure = $('#departure').val() !== '' ? '&departure=' + apiDate($('#departure').val()) : '';
      var guests = $('#guest-count').val() !== 'undefined' ? '?guests=' + $('#guest-count').val() : '';

      var url = '/search'+ guests + language + location + arrival + departure;

      window.location = url;

    })
  }

  if ($('form.inert').length) {
    $('form.inert').submit(function(e) {
      return false;
    })
  }

  if ($('.wallop').length) {
    $('.wallop').each(function() {
      var wallopEl = this;
      var slider = new Wallop(wallopEl);
    })
  }

  // Carousel
  if ($('.carousel').length) {
    $('.carousel').carousel({
      dist: 0,
    });
  }

  // Select2 language to learn
  if ($('select#language').length) {
    i18n.loadNamespaces(['search'], function() {
      var languagePlaceholder = $(window).width() < 601 ? i18n.t('search:language_to_learn_mobile') : i18n.t('search:language_to_learn');
      $("select#language").select2({
        placeholder: languagePlaceholder
      });
    });
  }

  // Select2 language to teach
  if ($('select#language-teach').length) {
    i18n.loadNamespaces(['search'], function() {
      $("select#language-teach").select2({
        placeholder: i18n.t('search:language_to_teach')
      });
    });
  }

  // Modal
  if ($('.modal-trigger').length) {
    $('.modal-trigger').leanModal();
  }

  // Select
  if ($('select.material').length) {
    $('select.material').material_select();
    $("select.material[required]").css({
      display: "block",
      height: '1px',
      padding: 0,
      width: '1px',
      opacity: 0,
      border: 0,
      position: 'absolute'
    });
  }

  // Sidenav
  if ($('.button-collapse').length) {
    $(".button-collapse").sideNav();
  }

  if ($('.become-a-host--logged-out').length) {
    $('.become-a-host--logged-out').click(function() {
      $('#choose-languages-modal').find('h6').html(i18n.t('common:language_modal_title_hosts'))
    })
  }

  if ($('.sign-up--logged-out').length) {
    $('.sign-up--logged-out').click(function() {
      $('#choose-languages-modal').find('h6').html(i18n.t('common:language_modal_title'))
    })
  }

});
