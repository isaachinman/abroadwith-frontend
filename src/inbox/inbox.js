var React = require('react');
var ReactDOM = require('react-dom');

var Inbox = require('./components/inbox.react');

if ($('#inbox-container').length) {
  // Manage home parent
  ReactDOM.render(
    <Inbox />, document.querySelector('#inbox-container')
  )
}

// Scroll to bottom of conversation thread
if ($('.message-body').length) {
  $('.message-body').scrollTop($('.message-body')[0].scrollHeight);
}

// Hide and show conversations
if ($('ul.message-list').length) {
  $('ul.message-list li').click(function() {
    if ($(this).attr('data-target') != null) {
      $('ul.message-list li').removeClass('active');
      $(this).addClass('active');
      var target = $(this).attr('data-target');
      $('.message-body').removeClass('active');
      $('#'+target).addClass('active');
      $('#'+target).scrollTop($('#'+target)[0].scrollHeight);
    }
  })
}
