var React = require('react');
var ReactDOM = require('react-dom');
var select2 = require('select2');
var LanguageChip = require('./components/language-chip.react');

//
var AddLanguage = React.createClass({
	getInitialState: function() {
  	return {
      languageChip: []
    };
  },
	onSubmit: function(e) {
  	e.preventDefault();

    if (this.refs.languageLearning.value && this.refs.levelLearning.value) {
    	this.setState({
      	languageChip: this.state.languageChip.concat({
          language: this.refs.languageLearning.value,
          level: this.refs.levelLearning.value
        })
      });
    }
  },
  render: function() {
    return (
    <div>

      <label>languageLearning</label><input ref="languageLearning"  /><br />
        <label>levelLearning</label><input ref="levelLearning" /><br />

      <div className='col s4 offset-s1'>
        <select id="language-learning" type="text" className="validate no-margin">
          <option></option>
          <option>English</option>
          <option>Spanish</option>
          <option>Portugese</option>
        </select>
      </div>
      <div className='col s4'>
        <select id="language-level" type="text" className="validate no-margin">
          <option></option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>
      <button type="submit" onSubmit={this.onSubmit}>Add</button>

      {(this.state.languageChip.length) ?
      	this.state.languageChip.map(function(chip, index) {
        	return <LanguageChip key={index} chip={chip} />;
        })
      : null}
    </div>
    );
  }
});

ReactDOM.render(
  <AddLanguage />,
  document.getElementById('language-chips')
);

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
// if ($('a#add-language').length && $('#language-learning').length && $('#language-level').length && $('#language-chips').length) {
//   var addLanguage = $('a#add-language');
//   addLanguage.click(function() {
//     var languageLearning = $('#language-learning');
//     var levelLearning =  $('#language-level');
//
//     if (languageLearning != null && levelLearning != null) {
//
//       ReactDOM.render(
//         <LanguageChip
//           language={languageLearning.val()}
//           level={levelLearning.val()}
//         />,
//         document.getElementById('language-chips')
//       );
//
//       languageLearning.select2('val', '');
//       levelLearning.select2('val', '');
//
//     }
//   })
// }

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
