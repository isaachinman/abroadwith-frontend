if ($('.scrollspy').length) {
  require('./scrollspy');
  $('.scrollspy').scrollSpy();
}

if ($('select#booking-immersions').length) {

  $(function() {
    $('.immersion-field').hide();
  })

  $('select#booking-immersions').change(function() {

    if ($(this).val() === 'stay') {

      // Hide and show for tandem
      $('.immersion-field').hide();

    } else if ($(this).val() === 'tandem') {

      // Hide and show for tandem
      $('.immersion-field').hide();
      $('.tandem-field:not(select)').show();

    } else if ($(this).val() === 'teacher') {

      // Hide and show for teacher
      $('.immersion-field').hide();
      $('.teacher-field:not(select)').show();

    }

  })

}
