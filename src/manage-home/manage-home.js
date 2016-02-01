// Language-known select
if ($('select#language-sought').length) {
  $('select#language-sought').select2({
    placeholder: "Choose a language you want to learn"
  });
}

// Add language-sought click handler
if ($('a#add-language').length && $('#language-sought').length && $('#discount').length && $('#language-chips').length) {

  $(function() {

    // Set permanent vars
    var addLanguage = $('a#add-language');
    var chipContainer = $('#language-chips');
    var languageSought = $('#language-sought');
    var discount =  $('#discount');

    addLanguage.click(function() {

      // Set conditional vars
      var languageCode = $('#language-sought option:selected').attr('data-lang');
      var levelCode =  discount.val().replace(/\D/g, '');

      if (languageSought.val() != '' && discount.val() != '' && $('.chip[data-lang="'+languageCode+'"]').length <= 0) {

        // Remove initial chip
        if ($('#language-chips').find($('.initial').length)) {
          $('#language-chips').find($('.initial')).remove();
        }

        var newLanguage = '<div class="language-chip chip" data-lang="' + languageCode + '" data-level="' + levelCode + '">' + languageSought.val() + ' (' + levelCode + '%)<i class="material-icons">close</i></div>'
        chipContainer.append(newLanguage);

        languageSought.select2('val', '');
        languageSought.val('');
        discount.select2('val', '');
        discount.val('');

      }
    })
  })
}

// Home photos
if ($('.home-photo').length) {
  var photos = $('.home-photo');
  photos.find('.delete').click(function() {
    $(this).parentsUntil('.col').remove()
  })
}
