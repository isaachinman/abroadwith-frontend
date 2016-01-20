// var React = require('react');
// var ReactDOM = require('react-dom');
var select2 = require('select2');
// var LanguageChip = require('./components/language-chip.react');
//
// // Chip array
// var chipsArray = [];
//
// // Language chip area
// var LanguageChips = React.createClass({
//   render: function() {
//     return (
//       <div>
//         {
//           (this.props.chipsArray).map(function(chip, index) {
//             return <LanguageChip
//               key={index}
//               language={chip.languageLearning}
//               level={chip.levelLearning}
//             />
//           })
//         }
//       </div>
//     );
//   }
// });
//
// ReactDOM.render(
//   <LanguageChips chipsArray={chipsArray} />,
//   document.getElementById('language-chips')
// );

// Language-learn select
if ($('select#language-learning').length) {
  $('select#language-learning').select2({
    placeholder: "Pick a language"
  });
}

// Level select
if ($('select#language-level').length) {
  $('select#language-level').select2({
    placeholder: "Level"
  });
}

// Language-known select
if ($('select#language-known').length) {
  $('select#language-known').select2({
    placeholder: "Pick a language"
  });
}

// Add language-learn click handler
if ($('a#add-language').length && $('#language-learning').length && $('#language-level').length && $('#language-chips').length) {

  $(function() {
    var addLanguage = $('a#add-language');
    var chipContainer = $('#language-chips');

    addLanguage.click(function() {

      var languageLearning = $('#language-learning');
      var levelLearning =  $('#language-level');

      var languageCode = $('#language-learning option:selected').attr('data-lang');
      var levelCode =  $('#language-level option:selected').attr('data-level');

      if (languageLearning.val() != '' && levelLearning.val() != '') {

        var newLanguage = '<div class="language-chip chip" data-lang="' + languageCode + '" data-level="' + levelCode + '">' + languageLearning.val() + ' (' + levelLearning.val() + ')<i class="material-icons">close</i></div>'
        chipContainer.append(newLanguage);

        languageLearning.select2('val', '');
        languageLearning.val('');
        levelLearning.select2('val', '');
        levelLearning.val('');

      }
    })
  })
}

// Language known click handler
if ($('a#add-language-known').length && $('#language-known').length && $('#language-known-chips').length) {

  $(function() {
    var addLanguage = $('a#add-language-known');
    var chipContainer = $('#language-known-chips');

    addLanguage.click(function() {

      var languageKnown = $('#language-known');

      var languageKnownCode = $('#language-known option:selected').attr('data-lang');

      if (languageKnown.val() != '') {

        var newLanguage = '<div class="language-known chip" data-lang="' + languageKnownCode + '">' + languageKnown.val() + ' (Native)<i class="material-icons">close</i></div>'
        chipContainer.append(newLanguage);

        languageKnown.select2('val', '');
        languageKnown.val('');

      }
    })
  })


}

// Form submit
if ($('form#signup').length) {

  var createUser = $('a#create-user');

  createUser.click(function() {

    if ($('form#signup input').length && $('.language-chip').length && $('.language-known').length) {

      // Get all inputs
      var signupForm = $('form#signup input');

      // Create signup object
      var newUser = {};

      // Mandatory learnt languages
      newUser["userLearningLanguages"] = [];

      // Mandatory known languages
      newUser["userKnownLanguages"] = [];

      for (var i=0, ii = signupForm.length; i<ii; i++) {
        var input = signupForm[i];
        if (input.name) {
          newUser[input.name] = input.value;
        }
      }

      $('.language-chip').each(function() {
        var newLanguage = {
          "language": $(this).attr('data-lang'),
          "level": $(this).attr('data-level')
        }
        newUser.userLearningLanguages.push(newLanguage);
      })

      $('.language-known').each(function() {
        var newLanguageKnown = {
          "language": $(this).attr('data-lang'),
          "level": "MOTHER_TONGUE"
        }
        newUser.userKnownLanguages.push(newLanguageKnown);
      })

      var letsSee = JSON.stringify(newUser);
      console.log(letsSee);

    }

  });
}
