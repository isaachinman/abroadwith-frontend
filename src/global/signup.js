var React = require('react');
var ReactDOM = require('react-dom');
require('select2');
var LanguageChip = require('./components/language-chip.react');

// Language select
if ($('select#language-learning').length) {
  $('select#language-learning').select2({
    placeholder: "Language"
  });
}

// Level select
if ($('select#language-level').length) {
  $('select#language-level').select2({
    placeholder: "Level"
  });
}

// Add language click handler
if ($('a#add-language').length && $('#language-learning').length && $('#language-level').length && $('#language-chips').length) {
  var addLanguage = $('a#add-language');
  addLanguage.click(function() {
    var languageLearning = $('#language-learning');
    var levelLearning =  $('#language-level');

    if (languageLearning != null && levelLearning != null) {

      ReactDOM.render(
        <LanguageChip
          language={languageLearning.val()}
          level={levelLearning.val()}
        />,
        document.getElementById('language-chips')
      );

      languageLearning.select2('val', '');
      levelLearning.select2('val', '');

    }
  })
}

// Form submit
if ($('form#signup').length) {

  var signupForm = $('form#signup input');
  var createUser = $('a#create-user');

  createUser.click(function() {

    // Create signup object
    var newUser = {};

    for (var i=0, ii = signupForm.length; i < ii; i++) {
      var input = signupForm[i];
      if (input.name) {
        newUser[input.name] = input.value;
      }
    }

    console.log(signupForm.length)

    console.log(newUser);

  });
}
