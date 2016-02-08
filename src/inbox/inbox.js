// Scroll to bottom of conversation thread
if ($('.message-body').length) {
  $('.message-body').each(function() {
    $(this).scrollTop($(this)[0].scrollHeight);
  })
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
