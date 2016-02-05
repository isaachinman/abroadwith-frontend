if ($('#book-a-room').length) {
  $('#book-a-room').click(function() {
    console.log('click')
    $('html, body').animate({
        scrollTop: $('#booking-row').offset().top - 50
    }, 250);
  })
}
