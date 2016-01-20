var React = require('react');
var ReactDOM = require('react-dom');
var select2 = require('select2');
var LanguageChip = require('./components/language-chip.react');

// Chip array
var chipsArray = [];

// Language chip area
var LanguageChips = React.createClass({
  render: function() {
    return (
      <div>
        {
          (this.props.chipsArray).map(function(chip, index) {
            return <LanguageChip
              key={index}
              language={chip.languageLearning}
              level={chip.levelLearning}
            />
          })
        }
      </div>
    );
  }
});

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

			chipsArray.push({
				languageLearning: languageLearning.val(),
				levelLearning: levelLearning.val()
			})

			ReactDOM.render(
      <LanguageChips chipsArray={chipsArray} />,
      document.getElementById('language-chips')
    	);

      languageLearning.select2('val', '');
      levelLearning.select2('val', '');

    }
  })
}

// Form submit
if ($('form#signup').length) {

  var createUser = $('a#create-user');

  createUser.click(function() {

    // Get all inputs
    var signupForm = $('form#signup input');

    // Create signup object
    var newUser = {};

    for (var i=0, ii = signupForm.length; i < ii; i++) {
      var input = signupForm[i];
      if (input.name) {
        newUser[input.name] = input.value;
      }
    }

    console.log(newUser);

  });
}
