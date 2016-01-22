// Language submit
function applyLanguages() {

  if ($('#language-chips').find('.language-chip').length && $('#language-known-chips').find('.language-known').length) {

    // Mandatory learnt languages
    newUser["userLearningLanguages"] = [];

    // Mandatory known languages
    newUser["userKnownLanguages"] = [];

    // Get learning languages
    $('.language-chip').each(function() {
      var newLanguage = {
        "language": $(this).attr('data-lang'),
        "level": $(this).attr('data-level')
      }
      newUser.userLearningLanguages.push(newLanguage);
    })

    // Get native languages
    $('.language-known').each(function() {
      var newLanguageKnown = {
        "language": $(this).attr('data-lang'),
        "level": "MOTHER_TONGUE"
      }
      newUser.userKnownLanguages.push(newLanguageKnown);
    })

    console.log(newUser);

    $('#choose-languages-modal').closeModal();
    $('#sign-up-modal').openModal();

  } else {
    if ($('#languages-not-valid').hasClass('hide')) {
      $('#languages-not-valid').removeClass('hide');
    }
  }
}

$('#apply-languages').click(function() {
  applyLanguages();
});
