const React = require('react')
const ReactDOM = require('react-dom')
const ManageHomeContainer = require('./components/manage-home-container.react')
const i18n = require('i18n')

if ($('#manage-home-container').length) {
  i18n.loadNamespaces(['languages','manage_home', 'immersions', 'homes', 'rooms', 'common'],function(){
    // Manage home parent
    ReactDOM.render(
      <ManageHomeContainer />, document.querySelector('#manage-home-container')
    )
  })

  function checkOffset() {
    if ($('.get-help-container').offset().top + $('.get-help-container').height() >= $('footer').offset().top - 10) {
      $('.get-help-container').css('position', 'absolute')
    }

    if ($(document).scrollTop() + window.innerHeight < $('footer').offset().top) {
      $('.get-help-container').css('position', 'fixed')
    }
  }

  $(document).scroll(function() {
    checkOffset()
  })

  setTimeout(function() {
    checkOffset()
    $('.get-help-container').fadeIn()
  }, 250)


}
