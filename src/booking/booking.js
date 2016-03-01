if ($('.scrollspy').length) {
  require('./scrollspy');
  $('.scrollspy').scrollSpy();
}

// Modify UI to match query params
function setQueriedValue(name) {
  if ($('select#'+name).attr('data-value') !== '') {
    $('select#'+name).val($('select#'+name).attr('data-value'));
  }
}

var potentialQueries = [
  "learning",
  "booking-immersions",
  "meal_plan",
  "meal_pref",
  "diet_restrictions",
  "course"
]

potentialQueries.forEach(setQueriedValue);

if ($('#guest-count').attr('data-guests') !== '') {
  $('select#EXTRA_GUEST').val($('#guest-count').attr('data-guests') - 1);
}


if ($('select#booking-immersions').length) {

  $(function() {
    $('.immersion-field').hide();
    $('select#booking-immersions').trigger('change');
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
