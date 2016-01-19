var select2 = require('select2');

if ($('a#add-language').length && $('#language-learning').length && $('#language-level').length && $('#language-chips').length) {
  var addLanguage = $('a#add-language');
  addLanguage.click(function() {
    var languageToAdd = $('#language-learning').val();
    var languageLevel = $('#language-level').val();
    console.log(languageToAdd + languageLevel);
    if (languageToAdd != null && languageLevel != null) {
      var newLanguageChip = '<div class="chip">' + languageToAdd + ' (' + languageLevel + ')' + '<i class="material-icons">close</i></div>';
      $('#language-chips').append(newLanguageChip);
    }
  })
}

if ($('select#language-learning').length) {
  $('select#language-learning').select2({
    placeholder: "What languages do you want to learn?"
  });
}

if ($('select#language-level').length) {
  $('select#language-level').select2({
    placeholder: "What languages do you know?"
  });
}
