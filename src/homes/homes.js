if ($('#book-a-room').length) {
  $('#book-a-room').click(function() {
    console.log('click')
    $('html, body').animate({
        scrollTop: $('#book-now').offset().top - 50
    }, 250);
  })
}

// If on a home page with at least one bookable room
if ($('.go-to-booking').length) {

  $('.go-to-booking').click(function() {
    if ($('#arrival').val() !== '' && $('#departure').val() !== '') {
      window.location = '/homes/' + $(this).attr('data-hid') + '/booking?arrival=' + $('#arrival').val() + '&departure=' + $('#departure').val() + '&room_id=' + $(this).attr('data-rid');
    }
  })

}
